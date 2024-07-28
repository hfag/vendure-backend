import { LanguageCode } from "@vendure/common/lib/generated-types";
import {
  ProductService,
  ProductVariantService,
  RequestContext,
  ShippingCalculator,
} from "@vendure/core";

enum TaxSetting {
  include = "include",
  exclude = "exclude",
  auto = "auto",
}

export const flatShippingCalculator = new ShippingCalculator({
  init: function (injector) {
    (this as any).productService = injector.get(ProductService);
    (this as any).productVariantService = injector.get(ProductVariantService);
  },
  code: "flat-shipping-calculator",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Flat-Rate",
    },
    {
      languageCode: LanguageCode.de,
      value: "Pauschalbetrag",
    },
  ],
  args: {
    defaultRate: {
      type: "int",
      defaultValue: 0,
      ui: { component: "currency-form-input" },
      label: [
        { languageCode: LanguageCode.en, value: "Shipping price" },
        { languageCode: LanguageCode.de, value: "Lieferkosten" },
      ],
    },
    includesTax: {
      type: "string",
      defaultValue: TaxSetting.auto,
      ui: {
        component: "select-form-input",
        options: [
          {
            label: [
              { languageCode: LanguageCode.en, value: "Includes tax" },
              { languageCode: LanguageCode.de, value: "Inklusive Steuern" },
            ],
            value: TaxSetting.include,
          },
          {
            label: [
              { languageCode: LanguageCode.en, value: "Excludes tax" },
              { languageCode: LanguageCode.en, value: "Exklusive Steuern" },
            ],
            value: TaxSetting.exclude,
          },
          {
            label: [
              {
                languageCode: LanguageCode.en,
                value: "Auto (based on Channel)",
              },
              {
                languageCode: LanguageCode.en,
                value: "Automatisch (basierend auf Vertriebskanal)",
              },
            ],
            value: TaxSetting.auto,
          },
        ],
      },
      label: [
        { languageCode: LanguageCode.en, value: "Price includes tax" },
        {
          languageCode: LanguageCode.en,
          value: "Beinhaltet der Preis bereits die Steuern",
        },
      ],
    },
    taxRate: {
      type: "float",
      defaultValue: 0,
      ui: { component: "number-form-input", suffix: "%" },
      label: [
        { languageCode: LanguageCode.en, value: "Tax rate" },
        { languageCode: LanguageCode.de, value: "Steursatz" },
      ],
    },
    facets: {
      type: "ID",
      list: true,
      ui: { component: "facet-value-form-input" },
    },
    facetRates: {
      type: "int",
      defaultValue: 0,
      list: true,
      ui: { component: "currency-form-input" },
      label: [
        { languageCode: LanguageCode.en, value: "Shipping price" },
        { languageCode: LanguageCode.de, value: "Lieferkosten" },
      ],
    },
  },
  calculate: async function (ctx, order, args) {
    let price = args.defaultRate;

    const productService = (this as any).options
      .productService as ProductService;

    const productVaraintService = (this as any).options
      .productVariantService as ProductVariantService;

    const products = await productService.findByIds(
      ctx,
      order.lines.map((line) => line.productVariant.productId)
    );

    const variants = await productVaraintService.findByIds(
      ctx,
      order.lines.map((line) => line.productVariant.id)
    );

    if (args.facets.length === args.facetRates.length) {
      price = order.lines.reduce((maxPrice, line) => {
        const product = products.find(
          (p) => p.id == line.productVariant.productId
        );

        if (!product) {
          console.log(products);
          throw new Error(
            `This should not be able to happen, we loaded this product before (id = ${line.productVariant.productId})`
          );
        }

        const variant = variants.find((p) => p.id == line.productVariant.id);

        if (!variant) {
          throw new Error(
            `This should not be able to happen, we loaded this variant before (id = ${line.productVariant.id})`
          );
        }

        const facetValueIds = [
          ...product.facetValues,
          ...variant.facetValues,
        ].map((v) => v.id);

        const maxPriceOverFacets = args.facets.reduce<number>(
          (maxPrice, facetId) => {
            const idx = facetValueIds.findIndex((id) => id == facetId);
            if (idx < 0) {
              return maxPrice;
            }

            const priceForFacet = args.facetRates[idx];

            return priceForFacet > maxPrice ? priceForFacet : maxPrice;
          },
          args.defaultRate
        );

        return maxPriceOverFacets > maxPrice ? maxPriceOverFacets : maxPrice;
      }, price);
    }

    return {
      price: price,
      taxRate: args.taxRate,
      priceIncludesTax: getPriceIncludesTax(
        ctx,
        args.includesTax as TaxSetting
      ),
    };
  },
});

function getPriceIncludesTax(
  ctx: RequestContext,
  setting: TaxSetting
): boolean {
  switch (setting) {
    case TaxSetting.auto:
      return ctx.channel.pricesIncludeTax;
    case TaxSetting.exclude:
      return false;
    case TaxSetting.include:
      return true;
  }
}
