import { VendurePlugin, PluginCommonModule } from "@vendure/core";
import gql from "graphql-tag";

import { CollectionProductResolver } from "./collection-products.resolver";

const schemaExtension = gql`
  extend type Collection {
    products: [Product!]!
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  adminApiExtensions: {
    schema: schemaExtension,
    resolvers: [CollectionProductResolver],
  },
  shopApiExtensions: {
    schema: schemaExtension,
    resolvers: [CollectionProductResolver],
  },
  configuration: (config) => {
    return config;
  },
})
export class CollectionProductsPlugin {}
