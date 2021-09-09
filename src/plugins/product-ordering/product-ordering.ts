import { VendurePlugin, PluginCommonModule, LanguageCode } from "@vendure/core";

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.Product.push({
      type: "int",
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
