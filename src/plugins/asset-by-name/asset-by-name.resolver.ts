import { Args, Resolver, Query } from "@nestjs/graphql";
import { Like } from "typeorm";
import {
  Ctx,
  RequestContext,
  Asset,
  TransactionalConnection,
} from "@vendure/core";

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
