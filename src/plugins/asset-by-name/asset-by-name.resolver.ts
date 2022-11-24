import { Args, Resolver, Query } from "@nestjs/graphql";
import {
  Ctx,
  RequestContext,
  Asset,
  TransactionalConnection,
} from "@vendure/core";
import { Like } from "typeorm";

@Resolver()
export class AssetByNameResolver {
  constructor(private connection: TransactionalConnection) {}

  @Query()
  async assetByName(
    @Ctx() ctx: RequestContext,
    @Args() args: { name: string }
  ): Promise<Asset | undefined> {
    return this.connection
      .getRepository(Asset)
      .findOne({ where: { source: Like("%" + args.name) } });
  }
}
