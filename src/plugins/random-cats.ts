import { Injectable } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import gql from "graphql-tag";
import http from "http";
import {
  Allow,
  Ctx,
  ProductService,
  RequestContext,
  VendureConfig,
  VendurePlugin,
  PluginCommonModule,
} from "@vendure/core";
import { Permission } from "@vendure/common/lib/generated-types";

const schemaExtension = gql`
  extend type Mutation {
    addRandomCat(id: ID!): Product!
  }
`;

@Injectable()
export class CatFetcher {
  /** Fetch a random cat image url from random.cat */
  fetchCat(): Promise<string> {
    return new Promise((resolve) => {
      http.get("http://aws.random.cat/meow", (resp) => {
        let data = "";
        resp.on("data", (chunk) => (data += chunk));
        resp.on("end", () => resolve(JSON.parse(data).file));
      });
    });
  }
}

@Resolver()
export class RandomCatResolver {
  constructor(
    private productService: ProductService,
    private catFetcher: CatFetcher
  ) {}

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async addRandomCat(@Ctx() ctx: RequestContext, @Args() args: { id: string }) {
    const catImageUrl = await this.catFetcher.fetchCat();
    return this.productService.update(ctx, {
      id: args.id,
      customFields: { catImageUrl },
    });
  }
}

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [CatFetcher],
  adminApiExtensions: {
    schema: schemaExtension,
    resolvers: [RandomCatResolver],
  },
  configuration: (config) => {
    config.customFields.Product.push({
      type: "string",
      name: "catImageUrl",
    });
    return config;
  },
})
export class RandomCatPlugin {}
