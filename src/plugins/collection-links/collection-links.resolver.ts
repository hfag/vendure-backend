import {
  Allow,
  Asset,
  AssetService,
  Collection,
  CollectionService,
  ConfigService,
  Ctx,
  ID,
  RequestContext,
  Transaction,
  TransactionalConnection,
  assertFound,
  translateDeep,
} from "@vendure/core";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import {
  CollectionLink,
  TranslatedAnyCollectionLink,
} from "./collection-link.entity";
import { CollectionLinkAsset } from "./collection-link-asset.entity";
import { CollectionLinkService } from "./collection-links.service";
import { CollectionLinkUrl } from "./collection-link-url.entity";
import { Connection } from "typeorm";
import {
  CreateCollectionLinkAssetInput,
  CreateCollectionLinkUrlInput,
  UpdateCollectionLinkAssetInput,
  UpdateCollectionLinkUrlInput,
} from ".";
import { Permission } from "@vendure/common/lib/generated-types";
import { Translated } from "@vendure/core/dist/common/types/locale-types";
import { notEmpty } from "./collection-links.service";

@Resolver()
export class CollectionLinksAdminResolver {
  constructor(
    private collectionLinkService: CollectionLinkService,
    private collectionService: CollectionService
  ) {}

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async createCollectionLinkUrl(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      input: CreateCollectionLinkUrlInput;
    }
  ): Promise<Translated<Collection>> {
    await this.collectionLinkService.createUrlLink(ctx, args.input);

    return assertFound(
      this.collectionService.findOne(ctx, args.input.collectionId)
    );
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async createCollectionLinkAsset(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      input: CreateCollectionLinkAssetInput;
    }
  ): Promise<Translated<Collection>> {
    await this.collectionLinkService.createAssetLink(ctx, args.input);

    return assertFound(
      this.collectionService.findOne(ctx, args.input.collectionId)
    );
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateCollectionAssetLink(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      input: UpdateCollectionLinkAssetInput;
    }
  ): Promise<Translated<Collection>> {
    const assetLink = await this.collectionLinkService.updateAssetLink(
      ctx,
      args.input
    );
    const collection = assertFound(
      this.collectionService.findOne(ctx, assetLink.collectionId)
    );
    return collection;
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateCollectionUrlLink(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      input: UpdateCollectionLinkUrlInput;
    }
  ): Promise<Translated<Collection>> {
    const assetLink = await this.collectionLinkService.updateUrlLink(
      ctx,
      args.input
    );
    const collection = assertFound(
      this.collectionService.findOne(ctx, assetLink.collectionId)
    );
    return collection;
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async deleteCollectionLink(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ): Promise<Collection> {
    const link = await assertFound(
      this.collectionLinkService.findOne(ctx, args.id)
    );
    await this.collectionLinkService.delete(args.id);

    return assertFound(this.collectionService.findOne(ctx, link.collectionId));
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateCollectionLinks(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      collectionId: ID;
      urlsToCreate: CreateCollectionLinkUrlInput[];
      urlsToUpdate: UpdateCollectionLinkUrlInput[];
      assetsToCreate: CreateCollectionLinkAssetInput[];
      assetsToUpdate: UpdateCollectionLinkAssetInput[];
      toDelete: ID[];
    }
  ): Promise<Collection> {
    const promises = [];

    for (const url of args.urlsToCreate) {
      promises.push(this.collectionLinkService.createUrlLink(ctx, url));
    }
    for (const url of args.urlsToUpdate) {
      promises.push(this.collectionLinkService.updateUrlLink(ctx, url));
    }

    for (const asset of args.assetsToCreate) {
      promises.push(this.collectionLinkService.createAssetLink(ctx, asset));
    }
    for (const asset of args.assetsToUpdate) {
      promises.push(this.collectionLinkService.updateAssetLink(ctx, asset));
    }

    for (const id of args.toDelete) {
      promises.push(
        assertFound(this.collectionLinkService.findOne(ctx, id)).then(
          (link) => {
            return this.collectionLinkService.delete(id);
          }
        )
      );
    }

    //@ts-ignore
    await Promise.all(promises);

    return assertFound(this.collectionService.findOne(ctx, args.collectionId));
  }
}

@Resolver("CollectionLink")
export class CollectionLinkEntityResolver {
  @ResolveField()
  __resolveType(@Parent() collectionLink: TranslatedAnyCollectionLink): string {
    if ("assetId" in collectionLink) {
      return "CollectionAssetLink";
    } else {
      return "CollectionUrlLink";
    }
  }
}

@Resolver("CollectionAssetLink")
export class CollectionAssetLinkResolverAdmin {
  constructor(private assetService: AssetService) {}

  @ResolveField()
  async asset(
    @Ctx() ctx: RequestContext,
    @Parent() collectionLinkAsset: CollectionLinkAsset
  ): Promise<Asset> {
    return assertFound(
      this.assetService.findOne(ctx, collectionLinkAsset.assetId)
    );
  }
}

@Resolver("Collection")
export class CollectionEntityResolverAdmin {
  constructor(
    private collectionLinkService: CollectionLinkService,
    private collectionService: CollectionService
  ) {}

  @ResolveField()
  async links(
    @Ctx() ctx: RequestContext,
    @Parent() collection: Collection
  ): Promise<TranslatedAnyCollectionLink[]> {
    return this.collectionLinkService.findAll(ctx, false, {
      where: { collection },
    });
  }
}

@Resolver("Collection")
export class CollectionEntityResolverShop {
  constructor(
    private connection: TransactionalConnection,
    private collectionLinkService: CollectionLinkService,
    private collectionService: CollectionService
  ) {}

  @ResolveField()
  async links(
    @Ctx() ctx: RequestContext,
    @Parent() collection: Collection
  ): Promise<
    {
      id: ID;
      collectionId: ID;
      icon: string;
      order: number;
      name: string;
      url: string;
    }[]
  > {
    const links = await this.collectionLinkService.findAll(ctx, true, {
      where: { collection },
    });

    const assets = await this.connection
      .getRepository(Asset)
      .findByIds(
        links.map((l) => ("assetId" in l ? l.assetId : null)).filter(notEmpty)
      );

    return links
      .map((l) => {
        if ("assetId" in l) {
          const asset = assets.find((a) => a.id === l.assetId);
          if (!asset) {
            return null;
          }

          return {
            id: l.linkId,
            collectionId: l.collectionId,
            icon: l.icon,
            order: l.order,
            name: asset.name,
            url: asset.source,
          };
        } else {
          return {
            id: l.linkId,
            collectionId: l.collectionId,
            icon: l.icon,
            order: l.order,
            name: l.name,
            url: l.url,
          };
        }
      })
      .filter(notEmpty)
      .sort((a, b) => a.order - b.order);
  }
}
