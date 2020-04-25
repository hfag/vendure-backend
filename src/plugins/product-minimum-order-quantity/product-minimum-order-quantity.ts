import {
  VendurePlugin,
  PluginCommonModule,
  ID,
  LanguageCode,
} from "@vendure/core";

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.ProductVariant.push({
      type: "int",
      name: "minimumOrderQuantity",
      label: [
        { languageCode: LanguageCode.en, value: "Minimum order quantity" },
      ],
    });
    return config;
  },
})
export class ProductMinimumOrderQuantityPlugin {}
