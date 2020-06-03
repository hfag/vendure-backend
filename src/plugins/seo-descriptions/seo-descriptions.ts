import {
  VendurePlugin,
  PluginCommonModule,
  ID,
  LanguageCode,
  CustomFieldConfig,
} from "@vendure/core";

const seoDescription: CustomFieldConfig = {
  type: "string",
  name: "seoDescription",
  label: [{ languageCode: LanguageCode.en, value: "SEO/Meta description" }],
};

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.Product.push(seoDescription);
    config.customFields.Collection.push(seoDescription);
    return config;
  },
})
export class SeoDescriptionsPlugin {}
