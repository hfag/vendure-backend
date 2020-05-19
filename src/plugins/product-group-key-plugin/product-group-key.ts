import {
  VendurePlugin,
  PluginCommonModule,
  ID,
  LanguageCode,
} from "@vendure/core";
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
      label: [{ languageCode: LanguageCode.en, value: "Product group key" }],
    });
    return config;
  },
})
export class ProductGroupKeyPlugin {}
