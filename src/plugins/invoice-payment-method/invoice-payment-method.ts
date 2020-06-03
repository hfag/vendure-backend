import {
  PaymentMethodHandler,
  LanguageCode,
  CreatePaymentResult,
  CreatePaymentErrorResult,
  SettlePaymentResult,
} from "@vendure/core";

export const InvoicePaymentIntegration = new PaymentMethodHandler({
  code: "invoice",
  description: [
    { languageCode: LanguageCode.en, value: "A simple invoice payment method" },
  ],
  args: {
    email: { type: "string" },
  },
  createPayment: async (
    order,
    args,
    metadata
  ): Promise<CreatePaymentResult | CreatePaymentErrorResult> => {
    return {
      amount: order.total,
      state: "Settled",
      transactionId: order.id.toString(),
      metadata: {},
    };
  },
  settlePayment: async (order, payment, args): Promise<SettlePaymentResult> => {
    return { success: true };
  },
});
