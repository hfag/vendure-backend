import { VendurePlugin, PluginCommonModule } from "@vendure/core";
import gql from "graphql-tag";

import { AssetByNameResolver } from "./asset-by-name.resolver";

const schemaExtension = gql`
  extend type Query {
    assetByName(name: String!): Asset
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  adminApiExtensions: {
    schema: schemaExtension,
    resolvers: [AssetByNameResolver],
  },
  configuration: (config) => {
    return config;
  },
})
export class AssetByNamePlugin {}
