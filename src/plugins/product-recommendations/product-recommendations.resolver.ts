import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { Allow, Ctx, ProductService, RequestContext, ID } from "@vendure/core";
import { Permission } from "@vendure/common/lib/generated-types";

import { ProductRecommendationService } from "./product-recommendation.service";
import {
  RecommendationType,
  ProductRecommendation,
} from "./product-recommendation.entity";

@Resolver()
export class ProductRecommendationAdminResolver {
  constructor(
    private productRecommendationService: ProductRecommendationService
  ) {}

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateCrossSellingProducts(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID; productIds: [ID] }
  ): Promise<Boolean> {
    const recommendations = await this.productRecommendationService.findAll({
      where: { product: args.productId, type: RecommendationType.CROSSSELL },
    });

    const recommendationsIds = recommendations.map((r) => r.recommendation.id);

    const toDelete = recommendations
      .filter((r) => !args.productIds.includes(r.recommendation.id))
      .map((r) => r.id);
    const toCreate = args.productIds.filter(
      (r) => !recommendationsIds.includes(r)
    );

    const promises: Promise<any>[] = toCreate.map((id) =>
      this.productRecommendationService.create({
        product: args.productId,
        recommendation: id,
        type: RecommendationType.CROSSSELL,
      })
    );

    if (toDelete.length > 0) {
      promises.push(
        this.productRecommendationService.delete(args.productId, toDelete)
      );
    }

    await Promise.all(promises);

    return true;
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateUpSellingProducts(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID; productIds: ID[] }
  ): Promise<Boolean> {
    const recommendations = await this.productRecommendationService.findAll({
      where: { product: args.productId, type: RecommendationType.UPSELL },
    });

    const recommendationsIds = recommendations.map((r) => r.recommendation.id);

    const toDelete = recommendations
      .filter((r) => !args.productIds.includes(r.recommendation.id))
      .map((r) => r.id);
    const toCreate = args.productIds.filter(
      (r) => !recommendationsIds.includes(r)
    );

    await Promise.all([
      toCreate.map((id) =>
        this.productRecommendationService.create({
          product: args.productId,
          recommendation: id,
          type: RecommendationType.UPSELL,
        })
      ),
      this.productRecommendationService.delete(args.productId, toDelete),
    ]);

    return true;
  }
}

@Resolver()
export class ProductRecommendationShopResolver {
  constructor(
    private productRecommendationService: ProductRecommendationService
  ) {}

  @Query()
  async productRecommendations(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID }
  ): Promise<ProductRecommendation[]> {
    return await this.productRecommendationService.findAll({
      where: { product: args.productId },
    });
  }
}
