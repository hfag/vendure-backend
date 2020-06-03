import {
  EmailEventListener,
  orderConfirmationHandler,
  emailVerificationHandler,
  passwordResetHandler,
  emailAddressChangeHandler,
  EmailEventHandler,
} from "@vendure/email-plugin";
import { OrderStateTransitionEvent, LanguageCode } from "@vendure/core";

const invoicePaymentHandler = new EmailEventListener("order-invoice-copy")
  .on(OrderStateTransitionEvent)
  .filter((event) => event.toState === "PaymentSettled")
  .setRecipient((event) => {
    if (!event.order.customer) {
      throw new Error(
        "Order in state PaymentSettled must have a customer email address"
      );
    }

    return event.order.customer.emailAddress;
  })
  .setSubject(`Neue Bestellung #{{ order.code }}`)
  .setTemplateVars((event) => ({
    order: event.order,
  }))
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

export const extendedHandlers: Array<EmailEventHandler<any, any>> = [
  extendedConfirmationHandler,
  extendedEmailVerificationHandler,
  extendedPasswordResetHandler,
  extendedEmailAddressChangeHandler,
  invoicePaymentHandler,
];
