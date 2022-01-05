import {
  AdjustmentType,
  Asset,
  Customer,
  Injector,
  LanguageCode,
  Order,
  OrderItem,
  OrderLine,
  OrderStateTransitionEvent,
  Payment,
  ProductVariant,
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
    .get(TransactionalConnection)
    .getRepository(ProductVariant)
    .findByIds(
      context.event.order.lines.map((l) => l.productVariant.id),
      { relations: ["featuredAsset"] }
    );

  for (const variant of variants) {
    featuredAssets[variant.id] = variant.featuredAsset;
  }

  return { shippingMethods, featuredAssets };
};

const orderSetTemplateVars = (
  event: EventWithAsyncData<
    OrderStateTransitionEvent,
    {
      shippingMethods: ShippingMethod[];
      featuredAssets: {
        [productVariantId: string]: Asset;
      };
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
      line.description = customizationString || "";
      /*(optionsString || "") +
        (optionsString && customizationString ? ", " : "") +*/

      return line;
    }),
  },
  shippingMethods: event.data.shippingMethods,
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
          priceWithTax: 0.5,
          price: 0.5,
          sku: "sku",
        },
        items: [new OrderItem({ listPrice: 0.5, listPriceIncludesTax: true })],
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
    }),
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
  .setSubject("New order #{{ order.id }}")
  .setTemplateVars(orderSetTemplateVars)
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.de,
    templateFile: "body.de.hbs",
    subject: "Neue Bestellung #{{ order.id }}",
  })
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.fr,
    templateFile: "body.fr.hbs",
    subject: "Neue Bestellung #{{ order.id }}",
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
  .setSubject("Order confirmation for #{{ order.id }}")
  .setTemplateVars(orderSetTemplateVars)
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.de,
    templateFile: "body.de.hbs",
    subject: "Bestellbestätigung für #{{ order.id }}",
  })
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.fr,
    templateFile: "body.fr.hbs",
    subject: "Bestellbestätigung für #{{ order.id }}",
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
