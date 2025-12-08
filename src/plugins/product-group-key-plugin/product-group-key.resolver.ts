import { Args, Resolver, Query } from "@nestjs/graphql";
import {
  Ctx,
  RequestContext,
  Product,
  TransactionalConnection,
} from "@vendure/core";

@Resolver()
export class ProductGroupKeyAdminResolver {
  constructor(private connection: TransactionalConnection) {}

  @Query()
  async getProductByGroupKey(
    @Ctx() ctx: RequestContext,
    @Args() args: { productGroupKey: string }
  ): Promise<Product | null> {
    return this.connection
      .getRepository(ctx, Product)
      .createQueryBuilder("product")
      .where("customFieldsGroupkey = :key AND deletedAt IS NULL", {
        key: args.productGroupKey,
      })
      .getOne();
  }

  @Query()
  async getProductsByGroupKeys(
    @Ctx() ctx: RequestContext,
    @Args() args: { productGroupKeys: string[] }
  ): Promise<Product[]> {
    return this.connection
      .getRepository(ctx, Product)
      .createQueryBuilder("product")
      .where("customFieldsGroupkey IN (:keys) AND deletedAt IS NULL", {
        keys: args.productGroupKeys,
      })
      .getMany();
  }
}
