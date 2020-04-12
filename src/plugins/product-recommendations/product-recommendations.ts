import gql from "graphql-tag";
import { VendurePlugin, PluginCommonModule, ID } from "@vendure/core";

import {
  ProductRecommendation,
  RecommendationType,
} from "./product-recommendation.entity";
import {
  ProductRecommendationAdminResolver,
  ProductRecommendationShopResolver,
} from "./product-recommendations.resolver";
import { ProductRecommendationService } from "./product-recommendation.service";

export type ProductRecommendationInput = {
  product: ID;
  recommendation: ID;
  type: RecommendationType;
};

const adminSchemaExtension = gql`
  extend type Mutation {
    updateCrossSellingProducts(productId: ID!, productIds: [ID!]): Boolean!
    updateUpSellingProducts(productId: ID!, productIds: [ID!]): Boolean!
  }
`;

const shopSchemaExtension = gql`
  enum RecommendationType {
    CROSSSELL
    UPSELL
  }

  type ProductRecommendation {
    product: Product!
    recommendation: Product!
    type: RecommendationType!
  }
  extend type Query {
    productRecommendations(productId: ID!): [ProductRecommendation!]!
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ProductRecommendation],
  providers: [ProductRecommendationService],
  adminApiExtensions: {
    schema: adminSchemaExtension,
    resolvers: [ProductRecommendationAdminResolver],
  },
  shopApiExtensions: {
    schema: shopSchemaExtension,
    resolvers: [ProductRecommendationShopResolver],
  },
  configuration: (config) => {
    return config;
  },
})
export class ProductRecommendationPlugin {}
