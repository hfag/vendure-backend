import {
  PaymentMethodHandler,
  LanguageCode,
  CreatePaymentResult,
  CreatePaymentErrorResult,
  SettlePaymentResult,
  Order,
  Country,
  TransactionalConnection,
} from "@vendure/core";
import { CreateAddressInput } from "@vendure/common/lib/generated-types";

let connection: null | TransactionalConnection = null;

export const InvoicePaymentIntegration = new PaymentMethodHandler({
  code: "invoice",
  description: [
    { languageCode: LanguageCode.en, value: "A simple invoice payment method" },
    {
      languageCode: LanguageCode.de,
      value: "Eine simple Bezahlart per Rechnung",
    },
  ],
  args: {
    copyEmail: {
      type: "string",
      label: [
        {
          languageCode: LanguageCode.en,
          value: "Email",
        },
        {
          languageCode: LanguageCode.de,
          value: "E-Mail",
        },
      ],
      description: [
        {
          languageCode: LanguageCode.en,
          value: "Address where copies should be sent to",
        },
        {
          languageCode: LanguageCode.de,
          value: "E-Mail an die Rechnungskopien gesendet werden sollen",
        },
      ],
    },
  },
  init: function (injector) {
    connection = injector.get(TransactionalConnection);
  },
  destroy: function () {
    connection = null;
  },
  createPayment: async function (
    ctx,
    order,
    args,
    metadata
  ): Promise<CreatePaymentResult | CreatePaymentErrorResult> {
    if (!connection) {
      throw new Error(
        "Object has already been destroyed or not created yet. Try again."
      );
    }

    return {
      amount: order.total,
      state: "Settled",
      transactionId: order.id.toString(),
      metadata: { copyEmail: args.copyEmail },
    };
  },
  settlePayment: async (order, payment, args): Promise<SettlePaymentResult> => {
    return { success: true };
  },
});
