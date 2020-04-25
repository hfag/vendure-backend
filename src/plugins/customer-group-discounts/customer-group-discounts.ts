import {
  VendurePlugin,
  PluginCommonModule,
  PromotionCondition,
  LanguageCode,
  PromotionOrderAction,
  Order,
} from "@vendure/core";

const groupMember = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "If the order is created by a member of group #{ group }",
    },
  ],
  code: "group_member",
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
  code: "not_group_member",
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

const applyResellerDiscount = new PromotionOrderAction({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Apply bulk discount configured elsewhere",
    },
  ],
  code: "bulk_discount",
  args: {},
  execute(order, args, { hasFacetValues }) {
    //TODO
    return 0;
  },
});

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    if (!config.promotionOptions.promotionActions) {
      config.promotionOptions.promotionActions = [];
    }

    if (!config.promotionOptions.promotionConditions) {
      config.promotionOptions.promotionConditions = [];
    }

    config.promotionOptions.promotionConditions.push(groupMember);
    config.promotionOptions.promotionConditions.push(notGroupMember);

    config.promotionOptions.promotionActions.push(variantFixedPriceWithTaxes);
    config.promotionOptions.promotionActions.push(applyResellerDiscount);

    return config;
  },
})
export class CustomerGroupDiscountsPlugin {}
