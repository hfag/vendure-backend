import { Args, Resolver, Query } from "@nestjs/graphql";
import { Connection, Like } from "typeorm";
import { Ctx, RequestContext, Asset } from "@vendure/core";

@Resolver()
export class AssetByNameResolver {
  constructor(private connection: Connection) {}

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
