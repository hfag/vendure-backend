import { Args, Resolver, Query, ResolveField, Parent } from "@nestjs/graphql";

import {
  Ctx,
  RequestContext,
  Product,
  Customer,
  ID,
  PromotionService,
  CustomerService,
  ProductVariant,
} from "@vendure/core";

@Resolver("Customer")
export class CustomerResellerDiscountResolver {
  constructor(
    private promotionService: PromotionService,
    private customerService: CustomerService
  ) {}

  @ResolveField()
  async resellerDiscounts(
    @Ctx() ctx: RequestContext,
    @Parent() customer: Customer
  ): Promise<
    {
      facetValueIds: ID[];
      discount: number;
    }[]
  > {
    const groups = await this.customerService.getCustomerGroups(
      ctx,
      customer.id
    );
    const activePromotions = await this.promotionService.getActivePromotions();

    return activePromotions
      .filter(
        (p) =>
          p.conditions.length === 1 &&
          p.conditions[0].code === "group-member-all" &&
          p.conditions[0].args[0].name === "groups" &&
          (JSON.parse(p.conditions[0].args[0].value) as ID[]).reduce(
            (b, group) =>
              b &&
              (groups.find((g) => g.id.toString() === group.toString())
                ? true
                : false),
            true
          ) &&
          p.actions.length === 1 &&
          p.actions[0].code === "facet_based_discount"
      )
      .map((p) => {
        const facets = p.actions[0].args.find((arg) => arg.name === "facets");
        const discount = p.actions[0].args.find(
          (arg) => arg.name === "discount"
        );

        return {
          facetValueIds: facets ? JSON.parse(facets.value) : [],
          discount: discount ? parseInt(discount.value) : 0,
        };
      });
  }
}

@Resolver("Product")
export class ProductResellerDiscountResolver {
  constructor(
    private promotionService: PromotionService,
    private customerService: CustomerService
  ) {}

  @ResolveField()
  async resellerDiscount(
    @Ctx() ctx: RequestContext,
    @Parent() product: Product
  ): Promise<number> {
    if (!ctx.activeUserId) {
      return 0;
    }
    const customer = await this.customerService.findOneByUserId(
      ctx,
      ctx.activeUserId
    );
    if (!customer) {
      return 0;
    }

    const groups = await this.customerService.getCustomerGroups(
      ctx,
      customer.id
    );
    const activePromotions = await this.promotionService.getActivePromotions();

    return activePromotions
      .filter(
        (p) =>
          p.conditions.length === 1 &&
          p.conditions[0].code === "group-member-all" &&
          p.conditions[0].args[0].name === "groups" &&
          (JSON.parse(p.conditions[0].args[0].value) as ID[]).reduce(
            (b, group) =>
              b &&
              (groups.find((g) => g.id.toString() === group.toString())
                ? true
                : false),
            true
          ) &&
          p.actions.length === 1 &&
          p.actions[0].code === "facet_based_discount"
      )
      .filter((p) => {
        const facets = p.actions[0].args.find((arg) => arg.name === "facets");
        const facetValueIds = facets
          ? (JSON.parse(facets.value) as ID[]).map((e) => e.toString())
          : [];

        return product.facetValues.reduce<boolean>(
          (b, facet) => b || facetValueIds.includes(facet.id.toString()),
          false
        );
      })
      .map((p) => {
        const discount = p.actions[0].args.find(
          (arg) => arg.name === "discount"
        );

        return discount ? parseInt(discount.value) : 0;
      })
      .reduce((sum, d) => sum + d, 0);
  }
}

@Resolver("ProductVariant")
export class ProductVariantResellerDiscountResolver {
  constructor(
    private promotionService: PromotionService,
    private customerService: CustomerService
  ) {}

  @ResolveField()
  async resellerDiscount(
    @Ctx() ctx: RequestContext,
    @Parent() productVariant: ProductVariant
  ): Promise<number> {
    if (!ctx.activeUserId) {
      return 0;
    }
    const customer = await this.customerService.findOneByUserId(
      ctx,
      ctx.activeUserId
    );
    if (!customer) {
      return 0;
    }

    const groups = await this.customerService.getCustomerGroups(
      ctx,
      customer.id
    );
    const activePromotions = await this.promotionService.getActivePromotions();

    return activePromotions
      .filter(
        (p) =>
          p.conditions.length === 1 &&
          p.conditions[0].code === "group-member-all" &&
          p.conditions[0].args[0].name === "groups" &&
          (JSON.parse(p.conditions[0].args[0].value) as ID[]).reduce(
            (b, group) =>
              b &&
              (groups.find((g) => g.id.toString() === group.toString())
                ? true
                : false),
            true
          ) &&
          p.actions.length === 1 &&
          p.actions[0].code === "facet_based_discount"
      )
      .filter((p) => {
        const facets = p.actions[0].args.find((arg) => arg.name === "facets");
        const facetValueIds = facets
          ? (JSON.parse(facets.value) as ID[]).map((e) => e.toString())
          : [];

        return productVariant.facetValues.reduce<boolean>(
          (b, facet) => b || facetValueIds.includes(facet.id.toString()),
          false
        );
      })
      .map((p) => {
        const discount = p.actions[0].args.find(
          (arg) => arg.name === "discount"
        );

        return discount ? parseInt(discount.value) : 0;
      })
      .reduce((sum, d) => sum + d, 0);
  }
}
