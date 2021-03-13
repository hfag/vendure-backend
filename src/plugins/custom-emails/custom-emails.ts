import {
  EmailEventListener,
  orderConfirmationHandler,
  emailVerificationHandler,
  passwordResetHandler,
  emailAddressChangeHandler,
  EmailEventHandler,
} from "@vendure/email-plugin";
import { OrderStateTransitionEvent, LanguageCode } from "@vendure/core";

const orderConfirmationCopyHandler = new EmailEventListener(
  "order-confirmation-copy"
)
  .on(OrderStateTransitionEvent)
  .filter((event) =>
    event.toState === "PaymentSettled" &&
    event.order?.payments.find((p) => p.method === "invoice")
      ? true
      : false
  )
  .setFrom(`{{ fromAddress }}`)
  .setRecipient((event) => {
    const payment = event.order.payments.find((p) => p.method === "invoice");

    if (!payment) {
      throw new Error(
        "Internal server error, no invoice payment there even though we just checked for it! Bad interleaving?"
      );
    }

    return payment.metadata.copyEmail;
  })
  .setSubject(`New order #{{ order.code }}`)
  .setTemplateVars((event) => ({
    order: event.order,
  }))
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

const extendedConfirmationHandler = orderConfirmationHandler
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
  extendedConfirmationHandler,
  extendedEmailVerificationHandler,
  extendedPasswordResetHandler,
  extendedEmailAddressChangeHandler,
];
