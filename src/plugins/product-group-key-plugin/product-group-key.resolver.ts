import { Args, Resolver, Query } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  RequestContext,
  ID,
  Product,
  assertFound,
  TransactionalConnection,
} from "@vendure/core";

@Resolver()
export class ProductGroupKeyAdminResolver {
  constructor(private connection: TransactionalConnection) {}

  @Query()
  async getProductByGroupKey(
    @Ctx() ctx: RequestContext,
    @Args() args: { productGroupKey: string }
  ): Promise<Product | undefined> {
    return this.connection
      .getRepository(Product)
      .createQueryBuilder("product")
      .where("customFieldsGroupkey = :key", { key: args.productGroupKey })
      .getOne();
  }

  @Query()
  async getProductsByGroupKeys(
    @Ctx() ctx: RequestContext,
    @Args() args: { productGroupKeys: string[] }
  ): Promise<Product[]> {
    return this.connection
      .getRepository(Product)
      .createQueryBuilder("product")
      .where("customFieldsGroupkey IN (:keys)", { keys: args.productGroupKeys })
      .getMany();
  }
}
