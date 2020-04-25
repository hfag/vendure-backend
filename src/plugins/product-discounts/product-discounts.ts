import {
  VendurePlugin,
  PluginCommonModule,
  PromotionCondition,
  LanguageCode,
  PromotionOrderAction,
} from "@vendure/core";

const minimumProductQuantity = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "If at least { amount } of the product #{ product } is ordered",
    },
  ],
  code: "minimum_product_quantity",
  args: {
    product: { type: "int", config: { inputType: "default" } },
    amount: { type: "int", config: { inputType: "default" } },
  },
  check(order, args) {
    return (
      order.lines.find(
        (line) => line.productVariant.productId == args.product
      ) !== undefined
    );
  },
  priorityValue: 10,
});

const minimumVariantQuantity = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "If at least { amount } of the variant #{ variant } is ordered",
    },
  ],
  code: "minimum_variant_quantity",
  args: {
    variant: { type: "int", config: { inputType: "default" } },
    amount: { type: "int", config: { inputType: "default" } },
  },
  check(order, args) {
    return (
      order.lines.find((line) => line.productVariant.id == args.variant) !==
      undefined
    );
  },
  priorityValue: 10,
});

const hasFacets = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "If a variant has the facet values { facets }",
    },
  ],
  code: "has_facet",
  args: {
    facets: { type: "facetValueIds" },
  },
  async check(order, args, { hasFacetValues }) {
    for (const line of order.lines) {
      if (await hasFacetValues(line, args.facets)) {
        return true;
      }
    }
    return false;
  },
  priorityValue: 10,
});

const always = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Always",
    },
  ],
  code: "always",
  args: {},
  check(order, args) {
    return true;
  },
  priorityValue: 10,
});

//PromotionActions

const productPercentageDiscount = new PromotionOrderAction({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Reduce price of product #{ product } by { discount }%",
    },
  ],
  code: "product_percentage_discount",
  args: {
    product: { type: "int", config: { inputType: "default" } },
    discount: { type: "int", config: { inputType: "percentage" } },
  },
  execute(order, args) {
    const total = order.lines
      .filter((line) => line.productVariant.productId == args.product)
      .map((line) => line.totalPrice)
      .reduce((a, b) => a + b);

    return -total * (args.discount / 100);
  },
});

const variantPercentageDiscount = new PromotionOrderAction({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Reduce price of variant #{ variant } by { discount }%",
    },
  ],
  code: "product_percentage_discount",
  args: {
    variant: { type: "int", config: { inputType: "default" } },
    discount: { type: "int", config: { inputType: "percentage" } },
  },
  execute(order, args) {
    const total = order.lines
      .filter((line) => line.productVariant.id == args.variant)
      .map((line) => line.totalPrice)
      .reduce((a, b) => a + b);

    return -total * (args.discount / 100);
  },
});

const productFixedPriceWithTaxes = new PromotionOrderAction({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Set price of product #{ product } to { price } (taxes included)",
    },
  ],
  code: "product_fixed_price_taxes_included",
  args: {
    product: { type: "int", config: { inputType: "default" } },
    price: { type: "int", config: { inputType: "money" } },
  },
  execute(order, args) {
    return order.lines
      .filter((line) => line.productVariant.productId == args.product)
      .map(
        (line) =>
          args.price * line.quantity - line.unitPriceWithTax * line.quantity
      )
      .reduce((a, b) => a + b);
  },
});
const productFixedPriceWithoutTaxes = new PromotionOrderAction({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Set price of product #{ product } to { price } (taxes excluded)",
    },
  ],
  code: "product_fixed_price_taxes_excluded",
  args: {
    product: { type: "int", config: { inputType: "default" } },
    price: { type: "int", config: { inputType: "money" } },
  },
  execute(order, args) {
    return order.lines
      .filter((line) => line.productVariant.productId == args.product)
      .map(
        (line) => args.price * line.quantity - line.unitPrice * line.quantity
      )
      .reduce((a, b) => a + b);
  },
});

const variantFixedPriceWithTaxes = new PromotionOrderAction({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Set price of variant #{ variant } to { price } (taxes included)",
    },
  ],
  code: "variant_fixed_price_taxes_included",
  args: {
    variant: { type: "int", config: { inputType: "default" } },
    price: { type: "int", config: { inputType: "money" } },
  },
  execute(order, args) {
    return order.lines
      .filter((line) => line.productVariant.id == args.variant)
      .map(
        (line) =>
          args.price * line.quantity - line.unitPriceWithTax * line.quantity
      )
      .reduce((a, b) => a + b);
  },
});
const variantFixedPriceWithoutTaxes = new PromotionOrderAction({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Set price of variant #{ variant } to { price } (taxes excluded)",
    },
  ],
  code: "product_fixed_price_taxes_excluded",
  args: {
    variant: { type: "int", config: { inputType: "default" } },
    price: { type: "int", config: { inputType: "money" } },
  },
  execute(order, args) {
    return order.lines
      .filter((line) => line.productVariant.id == args.variant)
      .map(
        (line) => args.price * line.quantity - line.unitPrice * line.quantity
      )
      .reduce((a, b) => a + b);
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

    config.promotionOptions.promotionConditions.push(minimumProductQuantity);
    config.promotionOptions.promotionConditions.push(minimumVariantQuantity);
    config.promotionOptions.promotionConditions.push(hasFacets);
    config.promotionOptions.promotionConditions.push(always);

    config.promotionOptions.promotionActions.push(productPercentageDiscount);
    config.promotionOptions.promotionActions.push(variantPercentageDiscount);
    config.promotionOptions.promotionActions.push(productFixedPriceWithTaxes);
    config.promotionOptions.promotionActions.push(
      productFixedPriceWithoutTaxes
    );
    config.promotionOptions.promotionActions.push(variantFixedPriceWithTaxes);
    config.promotionOptions.promotionActions.push(
      variantFixedPriceWithoutTaxes
    );

    return config;
  },
})
export class ProductDiscountsPlugin {}
