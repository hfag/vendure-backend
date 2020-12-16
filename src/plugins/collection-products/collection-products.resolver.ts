import { Args, Resolver, Query, ResolveField, Parent } from "@nestjs/graphql";

import {
  Ctx,
  RequestContext,
  Product,
  ProductService,
  Collection,
  TransactionalConnection,
} from "@vendure/core";
import { Translated } from "@vendure/core/dist/common/types/locale-types";

@Resolver("Collection")
export class CollectionProductResolver {
  constructor(
    private connection: TransactionalConnection,
    private productService: ProductService
  ) {}

  @ResolveField()
  async products(
    @Ctx() ctx: RequestContext,
    @Parent() collection: Collection
  ): Promise<Translated<Product>[]> {
    const products = await this.connection
      .getRepository(Product)
      .createQueryBuilder("product")
      .select("product.id") //reduce memory consumption
      .innerJoin("product.variants", "variant")
      .innerJoin("variant.collections", "collection", "collection.id = :id", {
        id: collection.id,
      })
      .getMany();
    //not the most efficient i guess
    return this.productService.findByIds(
      ctx,
      products.map((p) => p.id)
    );
  }
}
