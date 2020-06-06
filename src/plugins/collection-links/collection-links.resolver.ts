import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  RequestContext,
  ID,
  Collection,
  CollectionService,
  assertFound,
  translateDeep,
} from "@vendure/core";
import { Permission } from "@vendure/common/lib/generated-types";

import { CollectionLinkService } from "./collection-links.service";
import { CollectionLink } from "./collection-links.entity";
import { CreateCollectionLinkInput, UpdateCollectionLinkInput } from ".";
import { Translated } from "@vendure/core/dist/common/types/locale-types";

@Resolver()
export class CollectionLinksAdminResolver {
  constructor(
    private collectionLinkService: CollectionLinkService,
    private collectionService: CollectionService
  ) {}

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async createCollectionLink(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      input: CreateCollectionLinkInput;
    }
  ): Promise<Translated<Collection>> {
    await this.collectionLinkService.create(ctx, args.input);

    return assertFound(
      this.collectionService.findOne(ctx, args.input.collectionId)
    );
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async createCollectionLinks(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      input: CreateCollectionLinkInput[];
    }
  ): Promise<Boolean> {
    await this.collectionLinkService.createMany(ctx, args.input);
    return true;
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateCollectionLink(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      input: UpdateCollectionLinkInput;
    }
  ): Promise<Translated<Collection>> {
    await this.collectionLinkService.update(ctx, args.input);
    const collection = assertFound(
      this.collectionService.findOne(ctx, args.input.collectionId)
    );
    return collection;
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateCollectionLinks(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      input: UpdateCollectionLinkInput[];
    }
  ): Promise<Boolean> {
    await this.collectionLinkService.updateMany(ctx, args.input);
    return true;
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async deleteCollectionLink(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<Boolean> {
    await this.collectionLinkService.delete(args.id);

    return true;
  }
}

@Resolver("CollectionLink")
export class CollectionLinkEntityResolver {
  constructor(private collectionService: CollectionService) {}

  @ResolveField()
  async collection(
    @Ctx() ctx: RequestContext,
    @Parent() collectionLink: CollectionLink
  ): Promise<Translated<Collection>> {
    return assertFound(
      this.collectionService.findOne(ctx, collectionLink.collectionId)
    );
  }
}

@Resolver("Collection")
export class CollectionEntityResolver {
  constructor(private collectionLinkService: CollectionLinkService) {}

  @ResolveField()
  async links(
    @Ctx() ctx: RequestContext,
    @Parent() collection: Collection
  ): Promise<Translated<CollectionLink>[]> {
    return this.collectionLinkService.findAll(ctx, {
      where: { collection: { id: collection.id } },
    });
  }
}
