import {
  ID,
  LanguageCode,
  PluginCommonModule,
  PromotionCondition,
  PromotionItemAction,
  VendurePlugin,
} from "@vendure/core";
import gql from "graphql-tag";

import { BulkDiscount } from "./bulk-discount.entity";
import {
  BulkDiscountAdminResolver,
  BulkDiscountEntityResolver,
  BulkDiscountShopResolver,
  ProductVariantEntityResolver,
} from "./bulk-discount.resolver";
import { BulkDiscountService } from "./bulk-discount.service";

export type BulkDiscountInput = {
  productVariantId: ID;
  discounts: { quantity: number; price: number }[];
};

const always = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Always",
    },
    {
      languageCode: LanguageCode.de,
      value: "Immer",
    },
  ],
  code: "always",
  args: {},
  check() {
    return true;
  },
  priorityValue: 10,
});

let bulkDiscountService: BulkDiscountService;

const applyBulkDiscount = new PromotionItemAction({
  init: function (injector) {
    bulkDiscountService = injector.get(BulkDiscountService);
  },
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Apply bulk discount configured in the product variants ",
    },
    {
      languageCode: LanguageCode.de,
      value: "Mengenrabatte anwenden die bei den Varianten konfiguriert sind",
    },
  ],
  code: "bulk-discount",
  args: {},
  execute: async function (ctx, orderItem, orderLine) {
    if (!bulkDiscountService) {
      console.error(
        "bulkDiscountService has already been destroyed or not created yet. No discounts are applied."
      );

      return 0;
    }

    const discounts = await bulkDiscountService.findByProductVariantId(
      ctx,
      orderLine.productVariant.id
    );
    const discount = discounts
      .sort((a, b) => b.quantity - a.quantity)
      .find((a) => a.quantity <= orderLine.quantity);

    return discount ? discount.price - orderLine.unitPrice : 0;
  },
});

//extend product

const adminSchemaExtension = gql`
  type BulkDiscount {
    productVariant: ProductVariant!
    quantity: Int!
    price: Int!
  }

  input BulkDiscountInput {
    quantity: Int!
    price: Int!
  }

  input BulkDiscountUpdate {
    productVariantId: ID!
    discounts: [BulkDiscountInput!]!
  }

  extend type Query {
    productBulkDiscounts(productId: ID!): [BulkDiscount!]!
  }

  extend type Mutation {
    updateBulkDiscounts(updates: [BulkDiscountUpdate!]!): Boolean!
  }

  extend type ProductVariant {
    bulkDiscounts: [BulkDiscount!]!
  }
`;

const shopSchemaExtension = gql`
  type BulkDiscount {
    productVariant: ProductVariant!
    quantity: Int!
    price: Int!
  }
  extend type Query {
    productBulkDiscounts(productId: ID!): [BulkDiscount!]!
  }
  extend type ProductVariant {
    bulkDiscounts: [BulkDiscount!]!
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [BulkDiscount],
  providers: [BulkDiscountService],
  adminApiExtensions: {
    schema: adminSchemaExtension,
    resolvers: [
      BulkDiscountAdminResolver,
      BulkDiscountEntityResolver,
      ProductVariantEntityResolver,
    ],
  },
  shopApiExtensions: {
    schema: shopSchemaExtension,
    resolvers: [
      BulkDiscountShopResolver,
      BulkDiscountEntityResolver,
      ProductVariantEntityResolver,
    ],
  },
  configuration: (config) => {
    if (!config.promotionOptions.promotionActions) {
      config.promotionOptions.promotionActions = [];
    }

    if (!config.promotionOptions.promotionConditions) {
      config.promotionOptions.promotionConditions = [];
    }

    config.promotionOptions.promotionConditions.push(always);

    config.promotionOptions.promotionActions.push(applyBulkDiscount);

    config.customFields.ProductVariant.push({
      name: "bulkDiscountEnabled",
      type: "boolean",
      public: true,
      //in the shop api there is no function call for updating product variants
      label: [
        { languageCode: LanguageCode.en, value: "Has bulk discounts" },
        { languageCode: LanguageCode.de, value: "Hat Mengenrabatte" },
      ],
    });

    return config;
  },
})
export class BulkDiscountPlugin {}
