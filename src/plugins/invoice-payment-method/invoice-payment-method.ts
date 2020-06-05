import {
  PaymentMethodHandler,
  LanguageCode,
  CreatePaymentResult,
  CreatePaymentErrorResult,
  SettlePaymentResult,
  PaymentMethodConfigOptions,
  PaymentMethodArgs,
  Order,
  Country,
} from "@vendure/core";
import { Connection } from "typeorm";
import { CreateAddressInput } from "@vendure/common/lib/generated-types";

interface ConnectedPaymentMethodConfigOptions<
  T extends PaymentMethodArgs = PaymentMethodArgs
> extends PaymentMethodConfigOptions<T> {
  connection: Connection | null;
}

class ConnectedPaymentMethodHandler<
  T extends PaymentMethodArgs = PaymentMethodArgs
> extends PaymentMethodHandler<T> {
  constructor(config: ConnectedPaymentMethodConfigOptions<T>) {
    super(config);
  }
}

export const InvoicePaymentIntegration = new ConnectedPaymentMethodHandler({
  connection: null,
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
    this.connection = injector.getConnection();
  },
  destroy: function () {
    this.connection = null;
  },
  createPayment: async function (
    this: ConnectedPaymentMethodHandler,
    order,
    args,
    metadata
  ): Promise<CreatePaymentResult | CreatePaymentErrorResult> {
    //@ts-ignore
    const connection: Connection = this["options"].connection;

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
