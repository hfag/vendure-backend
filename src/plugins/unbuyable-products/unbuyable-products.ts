import { LanguageCode, PluginCommonModule, VendurePlugin } from "@vendure/core";

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.Product.push({
      type: "boolean",
      public: true,
      //in the shop api there is no function call for updating product variants
      defaultValue: true,
      name: "buyable",
      label: [
        { languageCode: LanguageCode.en, value: "Buyable" },
        { languageCode: LanguageCode.de, value: "Kaufbar" },
      ],
    });
    return config;
  },
})
export class UnBuyableProductsPlugin {}
