import {
  EmailEventListener,
  emailVerificationHandler,
  passwordResetHandler,
  emailAddressChangeHandler,
  EmailEventHandler,
  EventWithAsyncData,
} from "@vendure/email-plugin";
import {
  OrderStateTransitionEvent,
  LanguageCode,
  Order,
  Customer,
  OrderLine,
  ProductVariant,
  OrderItem,
  AdjustmentType,
  ShippingMethod,
  TransactionalConnection,
  Asset,
  Injector,
} from "@vendure/core";

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
        event.data.featuredAssets[line.productVariant.featuredAsset.id];
      return line;
    }),
  },
  shippingMethods: event.data.shippingMethods,
});

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
  .setFrom(`{{ fromAddress }}`)
  .setSubject(`New order #{{ order.code }}`)
  .setTemplateVars(orderSetTemplateVars)
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.de,
    templateFile: "body.de.hbs",
    subject: "Neue Bestellung #{{ order.code }}",
  })
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.fr,
    templateFile: "body.fr.hbs",
    subject: "Neue Bestellung #{{ order.code }}",
  });

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
  .setFrom(`{{ fromAddress }}`)
  .setSubject(`Order confirmation for #{{ order.code }}`)
  .setTemplateVars(orderSetTemplateVars)
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.de,
    templateFile: "body.de.hbs",
    subject: "Bestellbestätigung für #{{ order.code }}",
  })
  .addTemplate({
    channelCode: "default",
    languageCode: LanguageCode.fr,
    templateFile: "body.fr.hbs",
    subject: "Bestellbestätigung für #{{ order.code }}",
  });

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
