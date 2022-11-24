import { VendurePlugin, PluginCommonModule } from "@vendure/core";
import gql from "graphql-tag";

import { ProductBySlugResolver } from "./product-by-slug.resolver";

const schemaExtension = gql`
  extend type Query {
    productBySlug(slug: String!): Product
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  adminApiExtensions: {
    schema: schemaExtension,
    resolvers: [ProductBySlugResolver],
  },
  shopApiExtensions: {
    schema: schemaExtension,
    resolvers: [ProductBySlugResolver],
  },
  configuration: (config) => {
    return config;
  },
})
export class ProductBySlugPlugin {}
