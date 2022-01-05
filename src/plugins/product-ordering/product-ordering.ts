import { LanguageCode, PluginCommonModule, VendurePlugin } from "@vendure/core";

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.Product.push({
      type: "int",
      public: true,
      //in the shop api there is no function call for updating product variants
      defaultValue: 0,
      name: "ordering",
      label: [
        { languageCode: LanguageCode.en, value: "Product ordering" },
        { languageCode: LanguageCode.de, value: "Produkt Reihenfolge" },
      ],
    });
    return config;
  },
})
export class ProductOrderingPlugin {}
