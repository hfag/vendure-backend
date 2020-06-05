import {
  VendurePlugin,
  PluginCommonModule,
  PromotionCondition,
  LanguageCode,
} from "@vendure/core";
import gql from "graphql-tag";
import { CustomerResellerDiscountResolver } from "./customer-group-discounts.resolver";

const schemaExtension = gql`
  type ResellerDiscount {
    facetValueIds: [ID!]!
    discount: Int!
  }

  extend type Customer {
    resellerDiscounts: [ResellerDiscount!]!
  }
`;

const groupMember = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "If the order is created by a member of group #{ group }",
    },
  ],
  code: "group-member",
  args: {
    group: { type: "int", config: { inputType: "default" } },
  },
  check(order, args) {
    return order.customer &&
      order.customer.groups.map((g) => g.id).includes(args.group)
      ? true
      : false;
  },
  priorityValue: 10,
});

const notGroupMember = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value:
        "If the order is created by a customer who's not a member of #{ group }",
    },
  ],
  code: "not-group-member",
  args: {
    group: { type: "int", config: { inputType: "default" } },
  },
  check(order, args) {
    return (
      !order.customer ||
      !order.customer.groups.map((g) => g.id).includes(args.group)
    );
  },
  priorityValue: 10,
});

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: schemaExtension,
    resolvers: [CustomerResellerDiscountResolver],
  },
  configuration: (config) => {
    if (!config.promotionOptions.promotionActions) {
      config.promotionOptions.promotionActions = [];
    }

    if (!config.promotionOptions.promotionConditions) {
      config.promotionOptions.promotionConditions = [];
    }

    config.promotionOptions.promotionConditions.push(groupMember);
    config.promotionOptions.promotionConditions.push(notGroupMember);

    return config;
  },
})
export class CustomerGroupDiscountsPlugin {}
