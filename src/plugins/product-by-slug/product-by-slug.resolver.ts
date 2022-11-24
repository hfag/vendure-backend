import { Args, Resolver, Query } from "@nestjs/graphql";
import { Ctx, RequestContext, Product, ProductService } from "@vendure/core";
import { Translated } from "@vendure/core/dist/common/types/locale-types";

@Resolver()
export class ProductBySlugResolver {
  constructor(private productService: ProductService) {}

  @Query()
  async productBySlug(
    @Ctx() ctx: RequestContext,
    @Args() args: { slug: string }
  ): Promise<Translated<Product> | undefined> {
    return await this.productService.findOneBySlug(ctx, args.slug);
  }
}
