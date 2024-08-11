import { LanguageCode } from "@vendure/common/lib/generated-types";
import {
  ProductService,
  ProductVariantService,
  RequestContext,
  ShippingCalculator,
  ShippingEligibilityChecker,
} from "@vendure/core";

enum TaxSetting {
  include = "include",
  exclude = "exclude",
  auto = "auto",
}

export const flatShippingCalculator = new ShippingCalculator({
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
  },
  calculate: async function (ctx, order, args) {
    return {
      price: args.defaultRate,
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

export const facetEligibilityChecker = new ShippingEligibilityChecker({
  init: function (injector) {
    (this as any).productService = injector.get(ProductService);
    (this as any).productVariantService = injector.get(ProductVariantService);
  },
  code: "facet-eligibility-checker",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Facet Eligibility Checker",
    },
    {
      languageCode: LanguageCode.de,
      value: "Facetten-Prüfer",
    },
  ],
  args: {
    requiredFacets: {
      type: "ID",
      list: true,
      ui: { component: "facet-value-form-input" },
      description: [
        {
          languageCode: LanguageCode.en,
          value: "Required Facets",
        },
        {
          languageCode: LanguageCode.de,
          value: "Benötigte Facetten",
        },
      ],
    },
    invalidFacets: {
      type: "ID",
      list: true,
      ui: { component: "facet-value-form-input" },
      description: [
        {
          languageCode: LanguageCode.en,
          value: "Invalid Facets",
        },
        {
          languageCode: LanguageCode.de,
          value: "Ungültige Facetten",
        },
      ],
    },
  },
  check: async function (ctx, order, args) {
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

    const [containsRequiredFacet, containsInvalidFacet] = order.lines.reduce<
      [boolean, boolean]
    >(
      ([containsRequiredFacet, containsInvalidFacet], line) => {
        const product = products.find(
          (p) => p.id == line.productVariant.productId
        );

        if (!product) {
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

        const containsSingleRequiredFacet = args.requiredFacets.find(
          (requiredFacet) =>
            facetValueIds.find((id) => id == requiredFacet) ? true : false
        )
          ? true
          : false;

        // assuming the number of facets is low, this O(n^2) check should be faster
        // than sorting twice with O(2*n*log(n)) + a O(n) check
        const containsSingleInvalidFacet =
          // check if there is an invalid facet
          args.invalidFacets.find((invalidFacet) =>
            facetValueIds.find((id) => id == invalidFacet) ? true : false
          )
            ? true
            : false;

        return [
          containsRequiredFacet || containsSingleRequiredFacet,
          containsInvalidFacet || containsSingleInvalidFacet,
        ];
      },
      [args.requiredFacets.length == 0, false]
    );

    return containsRequiredFacet && !containsInvalidFacet;
  },
});
