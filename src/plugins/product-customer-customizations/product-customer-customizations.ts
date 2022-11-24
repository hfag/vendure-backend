import { LanguageCode, PluginCommonModule, VendurePlugin } from "@vendure/core";
import gql from "graphql-tag";

import { ProductCustomerCustomizationsResolver } from "./product-customer-customizations.resolver";

const shopSchemaExtension = gql`
  extend type Mutation {
    addCustomItemToOrder(
      productVariantId: ID!
      quantity: Int!
      customizations: JSON
    ): UpdateOrderItemsResult!
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: shopSchemaExtension,
    resolvers: [ProductCustomerCustomizationsResolver],
  },
  configuration: (config) => {
    config.customFields.Product.push({
      type: "string",
      ui: {
        component: "json-editor-form-input",
      },
      name: "customizationOptions",
      public: true,
      readonly: false,
      nullable: true,
      label: [
        { languageCode: LanguageCode.en, value: "Customization Options" },
        {
          languageCode: LanguageCode.de,
          value: "Anpassungsoptionen",
        },
      ],
    });
    config.customFields.OrderLine.push({
      type: "string",
      name: "customizations",
      public: true,
      readonly: false,
      nullable: true,
      label: [
        { languageCode: LanguageCode.en, value: "Customizations" },
        {
          languageCode: LanguageCode.de,
          value: "Anpassungen",
        },
      ],
    });

    return config;
  },
})
export class ProductCustomerCustomizationsPlugin {}
