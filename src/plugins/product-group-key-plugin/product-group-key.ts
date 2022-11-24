import { LanguageCode, PluginCommonModule, VendurePlugin } from "@vendure/core";
import gql from "graphql-tag";

import { ProductGroupKeyAdminResolver } from "./product-group-key.resolver";

const adminSchemaExtension = gql`
  extend type Query {
    getProductByGroupKey(productGroupKey: String!): Product
    getProductsByGroupKeys(productGroupKeys: [String!]!): [Product!]!
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  adminApiExtensions: {
    schema: adminSchemaExtension,
    resolvers: [ProductGroupKeyAdminResolver],
  },
  configuration: (config) => {
    config.customFields.Product.push({
      type: "string",
      name: "groupKey",
      public: true,
      //in the shop api there is no function call for updating product variants
      label: [
        { languageCode: LanguageCode.en, value: "Product group key" },
        {
          languageCode: LanguageCode.de,
          value: "Produktgruppenbezeichnung",
        },
      ],
    });
    return config;
  },
})
export class ProductGroupKeyPlugin {}
