import { LanguageCode, PluginCommonModule, VendurePlugin } from "@vendure/core";

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.ProductVariant.push({
      type: "int",
      name: "minimumOrderQuantity",
      public: true,
      //in the shop api there is no function call for updating product variants
      label: [
        { languageCode: LanguageCode.en, value: "Minimum order quantity" },
        { languageCode: LanguageCode.de, value: "Minimale Bestellmenge" },
      ],
    });
    return config;
  },
})
export class ProductMinimumOrderQuantityPlugin {}
