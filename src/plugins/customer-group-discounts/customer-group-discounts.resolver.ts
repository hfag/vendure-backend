import { Args, Resolver, Query, ResolveField, Parent } from "@nestjs/graphql";

import {
  Ctx,
  RequestContext,
  Product,
  ProductService,
  Collection,
  Customer,
  ID,
  PromotionService,
} from "@vendure/core";
import { Translated } from "@vendure/core/dist/common/types/locale-types";

@Resolver("Customer")
export class CustomerResellerDiscountResolver {
  constructor(private promotionService: PromotionService) {}

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
    const activePromotions = await this.promotionService.getActivePromotions();
    return activePromotions
      .filter(
        (p) =>
          p.conditions.length === 1 &&
          p.conditions[0].code ===
            "always" /*&& customer.groups.find(g => g.id === p.conditions[0].args.groupId)*/ &&
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
