import {
  Customer,
  CustomerService,
  Injector,
  LanguageCode,
  Order,
  OrderLine,
  OrderStateTransitionEvent,
  Payment,
  ProductVariant,
  ProductVariantService,
  RequestContext,
  ShippingMethod,
  ShippingMethodService,
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
  const featuredAssets: {
    [productVariantId: string]: string;
  } = {};
  const productOptions: {
    [productVariantId: string]: string;
  } = {};

  const variants: ProductVariant[] = await context.injector
    .get(ProductVariantService)
    .findByIds(
      context.event.ctx,
      context.event.order.lines.map((l) => l.productVariant.id)
    );

  for (const variant of variants) {
    if (variant.featuredAsset) {
      featuredAssets[variant.id] = variant.featuredAsset.preview;
    }
    productOptions[variant.id] = variant.options.map((o) => o.name).join(", ");
  }

  let groups = "";
  if (context.event.order.customer?.id) {
    const gs = await context.injector
      .get(CustomerService)
      .getCustomerGroups(context.event.ctx, context.event.order.customer.id);

    groups = gs.map((g) => g.name).join(", ");
  }

  const shippingMethods = await context.injector
    .get(ShippingMethodService)
    .getActiveShippingMethods(context.event.ctx);

  return {
    featuredAssets,
    productOptions,
    totalTaxes: context.event.order.total * 0.081,
    groups,
    shippingMethods,
  };
};

const mapProvince = (p: string) => {
  switch (p) {
    case "aargau":
    case "argovie":
      return "AG";
    case "appenzell innerrhoden":
    case "appenzell rhodes-intérieures":
    case "appenzell rhodes-interieures":
    case "appenzell rhodes intérieures":
    case "appenzell rhodes interieures":
      return "AI";
    case "appenzell ausserrhoden":
    case "appenzell rhodes-extérieures":
    case "appenzell rhodes-exterieures":
    case "appenzell rhodes extérieures":
    case "appenzell rhodes exterieures":
      return "AR";
    case "bern":
    case "berne":
      return "BE";
    case "basel-landschaft":
    case "basel-land":
    case "baselland":
    case "basel land":
    case "bâle-campagne":
    case "bale-campagne":
    case "bâle campagne":
    case "bale campagne":
      return "BL";
    case "basel-stadt":
    case "baselstadt":
    case "basel stadt":
    case "bâle-ville":
    case "bale-ville":
    case "bâle ville":
    case "bale ville":
      return "BS";
    case "freiburg":
    case "fribourg":
      return "FR";
    case "genf":
    case "genève":
    case "geneve":
      return "GE";
    case "glarus":
    case "glaris":
      return "GL";
    case "graubünden":
    case "grisons":
      return "GR";
    case "jura":
      return "JU";
    case "luzern":
    case "lucerne":
      return "LU";
    case "neuenburg":
    case "neuchâtel":
    case "neuchatel":
      return "NE";
    case "nidwalden":
    case "nidwald":
      return "NW";
    case "obwalden":
    case "obwald":
      return "OW";
    case "st. gallen":
    case "st.gallen":
    case "saint-gall":
    case "saint gall":
      return "SG";
    case "schaffhausen":
    case "schaffhouse":
      return "SH";
    case "solothurn":
    case "soloturn":
    case "soleure":
      return "SO";
    case "schwyz":
    case "schwytz":
      return "SZ";
    case "thurgau":
    case "thurgovie":
      return "TG";
    case "tessin":
      return "TI";
    case "uri":
      return "UR";
    case "waadt":
    case "vaud":
      return "VD";
    case "wallis":
    case "valais":
      return "VS";
    case "zug":
    case "zoug":
      return "ZG";
    case "zürich":
    case "zurich":
      return "ZH";
    default:
      return p;
  }
};

const orderSetTemplateVars = (
  event: EventWithAsyncData<
    OrderStateTransitionEvent,
    {
      featuredAssets: {
        [productVariantId: string]: string;
      };
      productOptions: {
        [productVariantId: string]: string;
      };
      totalTaxes: number;
      groups?: string;
      shippingMethods: ShippingMethod[];
    }
  >
) => ({
  order: {
    id: event.order.id,
    orderPlacedAt: event.order.orderPlacedAt,
    billingAddress: {
      ...event.order.billingAddress,
      province: mapProvince(
        event.order.billingAddress.province?.toLowerCase() || ""
      ),
    },
    shippingAddress: {
      ...event.order.shippingAddress,
      province: mapProvince(
        event.order.shippingAddress.province?.toLowerCase() || ""
      ),
    },
    customer: { emailAddress: event.order.customer?.emailAddress },
    subTotal: event.order.subTotal,
    shipping: event.order.shipping,
    shippingMethods: event.order.shippingLines
      .map(
        (line) =>
          event.data.shippingMethods.find((m) => m.id == line.shippingMethodId)
            ?.name
      )
      .join(", "),
    //simple computation from data
    subtotalWithShipping: event.order.subTotal + event.order.shipping,
    totalTaxes: event.data.totalTaxes,
    /* Otherwise orders look very weird */
    totalWithTax: event.order.total * 1.081,
    //@ts-ignore
    customFields: { notes: event.order.customFields?.notes },
    lines: event.order.lines.map((line) => {
      /*let optionsString: string | null = null;
      if (line.productVariant.options.length > 0) {
        optionsString = line.productVariant.options
          .map((option) => option.name)
          .join(", ");
      }*/

      const customFields = line.customFields as { customizations?: string };
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

      return {
        description:
          (event.data.productOptions[line.productVariant.id] || "") +
          (event.data.productOptions[line.productVariant.id] &&
          customizationString
            ? ", "
            : "") +
          (customizationString || ""),
        quantity: line.quantity,
        proratedLinePrice: line.proratedLinePrice,
        productVariant: {
          name: line.productVariant.name,
          sku: line.productVariant.sku,
          featuredAsset: {
            preview: event.data.featuredAssets[line.productVariant.id],
          },
        },
      };
    }),
  },
  groups: event.data.groups,
});

export const mockOrderStateTransitionEvent = new OrderStateTransitionEvent(
  "ArrangingPayment",
  "PaymentSettled",
  {} as RequestContext,
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
  .setRecipient((event) => {
    if (!event.order.customer) {
      throw new Error(
        "'event.order.customer is undefined in 'order-confirmation''"
      );
    }
    return event.order.customer.emailAddress;
  })
  .setFrom("{{ fromAddress }}")
  .setSubject(
    'Confirmation for your order on {{ formatDate order.orderPlacedAt "dd.mm.yyyy" }}'
  )
  .setTemplateVars(orderSetTemplateVars)
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.de,
    templateFile: "body.de.hbs",
    subject:
      'Bestätigung für ihre Bestellung vom {{ formatDate order.orderPlacedAt "dd.mm.yyyy" }}',
  })
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.fr,
    templateFile: "body.fr.hbs",
    subject:
      'Confirmation de votre commande du {{ formatDate order.orderPlacedAt "dd.mm.yyyy" }}',
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
