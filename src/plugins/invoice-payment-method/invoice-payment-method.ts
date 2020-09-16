import {
  PaymentMethodHandler,
  LanguageCode,
  CreatePaymentResult,
  CreatePaymentErrorResult,
  SettlePaymentResult,
  Order,
  Country,
} from "@vendure/core";
import { Connection } from "typeorm";
import { CreateAddressInput } from "@vendure/common/lib/generated-types";

let connection: null | Connection = null;

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
    connection = injector.getConnection();
  },
  destroy: function () {
    connection = null;
  },
  createPayment: async function (
    order,
    args,
    metadata
  ): Promise<CreatePaymentResult | CreatePaymentErrorResult> {
    if (!connection) {
      throw new Error(
        "Object has already been destroyed or not created yet. Try again."
      );
    }

    const billingAddress: CreateAddressInput = metadata.billingAddress;

    const country = await connection
      .getRepository(Country)
      .findOne({ where: { code: billingAddress.countryCode } }); // countryService.findOneByCode(ctx, input.countryCode);

    if (!country) {
      throw new Error(
        "The given billing adddress is invalid (invalid country code)"
      );
    }

    order.billingAddress = {
      ...billingAddress,
      countryCode: billingAddress.countryCode,
      country: country.name,
    };
    connection.getRepository(Order).save(order);

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
