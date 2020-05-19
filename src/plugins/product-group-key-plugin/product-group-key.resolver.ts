import { Args, Resolver, Query } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  RequestContext,
  ID,
  Product,
  assertFound,
} from "@vendure/core";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";

@Resolver()
export class ProductGroupKeyAdminResolver {
  constructor(@InjectConnection() private connection: Connection) {}

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
