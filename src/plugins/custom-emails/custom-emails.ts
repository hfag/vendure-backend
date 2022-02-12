import {
  AdjustmentType,
  Asset,
  Customer,
  CustomerService,
  ID,
  Injector,
  LanguageCode,
  Order,
  OrderItem,
  OrderLine,
  OrderStateTransitionEvent,
  Payment,
  ProductOptionGroupService,
  ProductVariant,
  ProductVariantService,
  ShippingMethod,
  TransactionalConnection,
} from "@vendure/core";
import {
  EmailEventHandler,
  EmailEventListener,
  EventWithAsyncData,
  emailAddressChangeHandler,
  emailVerificationHandler,
  passwordResetHandler,
} from "@vendure/email-plugin";

const orderLoadData = async (context: {
  event: OrderStateTransitionEvent;
  injector: Injector;
}) => {
  const shippingMethods: ShippingMethod[] = [];
  const featuredAssets: {
    [productVariantId: string]: Asset;
  } = {};
  const productOptions: {
    [productVariantId: string]: string;
  } = {};

  for (const line of context.event.order.shippingLines || []) {
    let shippingMethod: ShippingMethod | undefined;
    if (!line.shippingMethod && line.shippingMethodId) {
      shippingMethod = await context.injector
        .get(TransactionalConnection)
        .getRepository(ShippingMethod)
        .findOne(line.shippingMethodId);
    } else if (line.shippingMethod) {
      shippingMethod = line.shippingMethod;
    }
    if (shippingMethod) {
      shippingMethods.push(shippingMethod);
    }
  }

  const variants: ProductVariant[] = await context.injector
    .get(ProductVariantService)
    .findByIds(
      context.event.ctx,
      context.event.order.lines.map((l) => l.productVariant.id)
    );

  for (const variant of variants) {
    featuredAssets[variant.id] = variant.featuredAsset;
    productOptions[variant.id] = variant.options.map((o) => o.name).join(", ");
  }

  let groups = "";
  if (context.event.order.customer?.id) {
    const gs = await context.injector
      .get(CustomerService)
      .getCustomerGroups(context.event.ctx, context.event.order.customer.id);

    groups = gs.map((g) => g.name).join(", ");
  }

  return {
    shippingMethods,
    featuredAssets,
    productOptions,
    totalTaxes: context.event.order.totalWithTax - context.event.order.total,
    groups,
  };
};

const orderSetTemplateVars = (
  event: EventWithAsyncData<
    OrderStateTransitionEvent,
    {
      shippingMethods: ShippingMethod[];
      featuredAssets: {
        [productVariantId: string]: Asset;
      };
      productOptions: {
        [productVariantId: string]: string;
      };
      totalTaxes: number;
      groups?: string;
    }
  >
) => ({
  order: {
    ...event.order,
    lines: event.order.lines.map((line) => {
      line.productVariant.featuredAsset =
        event.data.featuredAssets[line.productVariant.id];

      /*let optionsString: string | null = null;
      if (line.productVariant.options.length > 0) {
        optionsString = line.productVariant.options
          .map((option) => option.name)
          .join(", ");
      }*/

      const customFields = line.customFields as { [key: string]: any };
      let customizationString: string | null = null;

      if (customFields?.customizations) {
        try {
          const customizations = JSON.parse(customFields.customizations);
          customizationString = Object.keys(customizations)
            .map(
              (key) =>
                `${customizations[key].label}: ${customizations[key].value}`
            )
            .join(", ");
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }

      //@ts-ignore
      line.description =
        (event.data.productOptions[line.productVariant.id] || "") +
        (event.data.productOptions[line.productVariant.id] &&
        customizationString
          ? ", "
          : "") +
        (customizationString || "");

      return line;
    }),
    totalTaxes: event.data.totalTaxes,
  },
  shippingMethods: event.data.shippingMethods,
  groups: event.data.groups,
});

export const mockOrderStateTransitionEvent = new OrderStateTransitionEvent(
  "ArrangingPayment",
  "PaymentSettled",
  {} as any,
  new Order({
    id: 1,
    billingAddress: {
      city: "Night City",
      province: "California",
      phoneNumber: "+41 00 000 00 00",
      postalCode: "0000",
      streetLine1: "Street #NUM",
    },
    shippingAddress: {
      city: "Night City",
      province: "California",
      phoneNumber: "+41 00 000 00 00",
      postalCode: "0000",
      streetLine1: "Street #NUM",
    },
    state: "PaymentSettled",
    payments: [
      new Payment({
        method: "invoice",
        //@ts-ignore
        metadata: { copyEmail: "copy@email.com" },
      }),
    ],
    lines: [
      new OrderLine({
        productVariant: {
          name: "Dummy Product",
          priceWithTax: 1070,
          price: 1000,
          sku: "sku",
        },
        items: [
          new OrderItem({ listPrice: 1000, listPriceIncludesTax: false }),
        ],
        customFields: {
          customizations: '{"field":{"label": "label","value":"value"}}',
        },
      }),
    ],
    customer: new Customer({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      emailAddress: "john@doe.us",
      phoneNumber: "+41 00 000 00 00",
      groups: [{ name: "Schilder-20" }],
    }),
    subTotal: 1000,
    subTotalWithTax: 1070,
    shippingLines: [
      { listPrice: 1250, price: 1250, priceWithTax: 1338, taxRate: 1.07 },
    ],
    shipping: 1250,
    shippingWithTax: 1338,
    taxZoneId: 1,
    customFields: {
      notes: "Some customer note",
    },
  })
);

const orderConfirmationCopyHandler = new EmailEventListener(
  "order-confirmation-copy"
)
  .on(OrderStateTransitionEvent)
  .filter((event) =>
    event.toState === "PaymentSettled" &&
    event.fromState !== "Modifying" &&
    event.order?.payments.find((p) => p.method === "invoice")
      ? true
      : false
  )
  .loadData(orderLoadData)
  .setRecipient((event) => {
    const payment = event.order.payments.find((p) => p.method === "invoice");

    if (!payment) {
      throw new Error(
        "Internal server error, no invoice payment there even though we just checked for it?!?"
      );
    }

    return payment.metadata.copyEmail;
  })
  .setFrom("{{ fromAddress }}")
  .setSubject("Order ({{ order.id }}) by {{ order.billingAddress.fullName }}")
  .setTemplateVars(orderSetTemplateVars)
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.de,
    templateFile: "body.de.hbs",
    subject:
      "Bestellung ({{ order.id }}) von {{ order.billingAddress.fullName }}",
  })
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.fr,
    templateFile: "body.fr.hbs",
    subject: "Commande ({{ order.id }}) de {{ order.billingAddress.fullName }}",
  })
  .setMockEvent(mockOrderStateTransitionEvent);

const orderConfirmationHandler = new EmailEventListener("order-confirmation")
  .on(OrderStateTransitionEvent)
  .filter(
    (event) =>
      event.toState === "PaymentSettled" &&
      event.fromState !== "Modifying" &&
      !!event.order.customer
  )
  .loadData(orderLoadData)
  .setRecipient((event) => event.order.customer!.emailAddress)
  .setFrom("{{ fromAddress }}")
  .setSubject(
    'Confirmation for your order on {{ formatDate order.orderPlacedAt "dd. mm yyyy" }}'
  )
  .setTemplateVars(orderSetTemplateVars)
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.de,
    templateFile: "body.de.hbs",
    subject:
      'Bestätigung für ihre Bestellung vom {{ formatDate order.orderPlacedAt "dd. mm yyyy" }}',
  })
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.fr,
    templateFile: "body.fr.hbs",
    subject:
      'Confirmation de votre commande du {{ formatDate order.orderPlacedAt "dd. mm yyyy" }}',
  })
  .setMockEvent(mockOrderStateTransitionEvent);

const extendedEmailVerificationHandler = emailVerificationHandler
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.de,
    templateFile: "body.de.hbs",
    subject: "E-Mail bestätigen",
  })
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.fr,
    templateFile: "body.fr.hbs",
    subject: "E-Mail bestätigen",
  });

const extendedPasswordResetHandler = passwordResetHandler
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.de,
    templateFile: "body.de.hbs",
    subject: "Passwort zurücksetzen",
  })
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.fr,
    templateFile: "body.fr.hbs",
    subject: "Passwort zurücksetzen",
  });
const extendedEmailAddressChangeHandler = emailAddressChangeHandler
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.de,
    templateFile: "body.de.hbs",
    subject: "Neue E-Mail bestätigen",
  })
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.fr,
    templateFile: "body.fr.hbs",
    subject: "Neue E-Mail bestätigen",
  });

export const emailHandlers: Array<EmailEventHandler<any, any>> = [
  orderConfirmationCopyHandler,
  orderConfirmationHandler,
  extendedEmailVerificationHandler,
  extendedPasswordResetHandler,
  extendedEmailAddressChangeHandler,
];
