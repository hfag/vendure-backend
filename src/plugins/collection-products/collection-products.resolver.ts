import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
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
      .getRepository(ctx, Product)
      .createQueryBuilder("product")
      .select("product.id") //reduce memory consumption
      .innerJoin("product.variants", "variant")
      .innerJoin("variant.collections", "collection", "collection.id = :id", {
        id: collection.id,
      })
      .where("product.enabled = 1")
      .getMany();

    if (products.length === 0) {
      //otherwise findByIds fails
      return [];
    }

    //not the most efficient i guess
    return this.productService.findByIds(
      ctx,
      products.map((p) => p.id)
    );
  }
}
