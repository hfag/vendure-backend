import { LanguageCode, PluginCommonModule, VendurePlugin } from "@vendure/core";

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.Order.push({
      name: "notes",
      type: "string",
      public: true,
      readonly: false,
      nullable: true,
      label: [
        { languageCode: LanguageCode.en, value: "Notes" },
        { languageCode: LanguageCode.de, value: "Notizen" },
        { languageCode: LanguageCode.de_AT, value: "Notizen" },
        { languageCode: LanguageCode.de_CH, value: "Notizen" },
      ],
    });
    return config;
  },
})
export class OrderNotes {}
