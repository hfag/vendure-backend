import {
  Allow,
  Asset,
  AssetService,
  Collection,
  CollectionEvent,
  CollectionService,
  ConfigService,
  Ctx,
  EventBus,
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
    private collectionService: CollectionService,
    private eventBus: EventBus
  ) {}

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

    //without this ignore a weird error occurs
    //@ts-ignore
    await Promise.all(promises);

    const collection = await this.collectionService.findOne(
      ctx,
      args.collectionId
    );

    if (!collection) {
      throw new Error("Could not find the collection we just updated!");
    }

    this.eventBus.publish(new CollectionEvent(ctx, collection, "updated"));
    return collection;
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
