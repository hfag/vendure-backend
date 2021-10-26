import {
  ID,
  LanguageCode,
  PluginCommonModule,
  VendurePlugin,
} from "@vendure/core";
import { ProductGroupKeyAdminResolver } from "./product-group-key.resolver";
import gql from "graphql-tag";

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
