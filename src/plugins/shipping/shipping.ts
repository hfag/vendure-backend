import { LanguageCode } from "@vendure/common/lib/generated-types";
import { RequestContext, ShippingCalculator } from "@vendure/core";

enum TaxSetting {
  include = "include",
  exclude = "exclude",
  auto = "auto",
}

export const flatShippingCalculator = new ShippingCalculator({
  code: "flat-shipping-calculator",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Flat-Rate",
    },
    {
      languageCode: LanguageCode.de,
      value: "Pauschalbetrag",
    },
  ],
  args: {
    rate: {
      type: "int",
      defaultValue: 0,
      ui: { component: "currency-form-input" },
      label: [
        { languageCode: LanguageCode.en, value: "Shipping price" },
        { languageCode: LanguageCode.de, value: "Lieferkosten" },
      ],
    },
    includesTax: {
      type: "string",
      defaultValue: TaxSetting.auto,
      ui: {
        component: "select-form-input",
        options: [
          {
            label: [
              { languageCode: LanguageCode.en, value: "Includes tax" },
              { languageCode: LanguageCode.de, value: "Inklusive Steuern" },
            ],
            value: TaxSetting.include,
          },
          {
            label: [
              { languageCode: LanguageCode.en, value: "Excludes tax" },
              { languageCode: LanguageCode.en, value: "Exklusive Steuern" },
            ],
            value: TaxSetting.exclude,
          },
          {
            label: [
              {
                languageCode: LanguageCode.en,
                value: "Auto (based on Channel)",
              },
              {
                languageCode: LanguageCode.en,
                value: "Automatisch (basierend auf Vertriebskanal)",
              },
            ],
            value: TaxSetting.auto,
          },
        ],
      },
      label: [
        { languageCode: LanguageCode.en, value: "Price includes tax" },
        {
          languageCode: LanguageCode.en,
          value: "Beinhaltet der Preis bereits die Steuern",
        },
      ],
    },
    taxRate: {
      type: "float",
      defaultValue: 0,
      ui: { component: "number-form-input", suffix: "%" },
      label: [
        { languageCode: LanguageCode.en, value: "Tax rate" },
        { languageCode: LanguageCode.de, value: "Steursatz" },
      ],
    },
  },
  calculate: (ctx, order, args) => {
    return {
      price: args.rate,
      taxRate: args.taxRate,
      priceIncludesTax: getPriceIncludesTax(
        ctx,
        args.includesTax as TaxSetting
      ),
    };
  },
});

function getPriceIncludesTax(
  ctx: RequestContext,
  setting: TaxSetting
): boolean {
  switch (setting) {
    case TaxSetting.auto:
      return ctx.channel.pricesIncludeTax;
    case TaxSetting.exclude:
      return false;
    case TaxSetting.include:
      return true;
  }
}
