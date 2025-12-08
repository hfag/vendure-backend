import { Injectable } from "@nestjs/common";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import {
  ID,
  assertFound,
  RequestContext,
  translateDeep,
  CollectionService,
  AssetService,
  TransactionalConnection,
} from "@vendure/core";
import { Translated } from "@vendure/core/dist/common/types/locale-types";
import { TranslatableSaver } from "@vendure/core/dist/service/helpers/translatable-saver/translatable-saver";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";

import { CollectionLinkAsset } from "./collection-link-asset.entity";
import { CollectionLinkUrlTranslation } from "./collection-link-url-translation.entity";
import { CollectionLinkUrl } from "./collection-link-url.entity";
import {
  CollectionLink,
  TranslatedAnyCollectionLink,
} from "./collection-link.entity";
import {
  CreateCollectionLinkUrlInput,
  CreateCollectionLinkAssetInput,
  UpdateCollectionLinkUrlInput,
  UpdateCollectionLinkAssetInput,
} from "./index";

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

@Injectable()
export class CollectionLinkService {
  constructor(
    private connection: TransactionalConnection,
    private assetService: AssetService,
    private collectionService: CollectionService,
    private translatableSaver: TranslatableSaver
  ) {}

  async findAll(
    ctx: RequestContext,
    restrictLocale?: boolean,
    options?: FindManyOptions<CollectionLink>
  ): Promise<TranslatedAnyCollectionLink[]> {
    const collectionLinks = await this.connection
      .getRepository(ctx, CollectionLink)
      .find(options);

    if (collectionLinks.length === 0) {
      return [];
    }

    const urlLinks = collectionLinks.filter((l) => l.type === "url");
    const assetLinks = collectionLinks.filter((l) => l.type === "asset");

    const collectionLinkUrlsPromise =
      urlLinks.length === 0
        ? Promise.resolve([])
        : this.connection
            .getRepository(ctx, CollectionLinkUrl)
            .find({
              where: urlLinks.map((collectionLink) => ({
                collectionLink: { id: collectionLink.id },
              })),
            })
            .then((links) =>
              links.map((urlLink) => {
                const collectionLink = urlLinks.find(
                  (l) => l.id == urlLink.collectionLinkId
                );

                if (!collectionLink) {
                  throw new Error(
                    "Invariant violated, coult not find any 'CollectionLinkUrl' corresponding to a 'CollectionLink' of type 'url'"
                  );
                }

                return {
                  ...collectionLink,
                  ...translateDeep(urlLink, ctx.languageCode),
                  linkUrlId: urlLink.id,
                  linkId: collectionLink.id,
                };
              })
            );

    const collectionLinkAssetsPromise =
      assetLinks.length === 0
        ? Promise.resolve([])
        : this.connection
            .getRepository(ctx, CollectionLinkAsset)
            .find({
              where: assetLinks.map((collectionLink) => ({
                collectionLink: { id: collectionLink.id },
              })),
            })
            .then((links) =>
              links.map((assetLink) => {
                const collectionLink = assetLinks.find(
                  (l) => l.id == assetLink.collectionLinkId
                );

                if (!collectionLink) {
                  throw new Error(
                    "Invariant violated, coult not find any 'CollectionLinkAsset' corresponding to a 'CollectionLink' of type 'asset'"
                  );
                }

                return {
                  ...collectionLink,
                  ...assetLink,
                  linkAssetId: assetLink.id,
                  linkId: collectionLink.id,
                };
              })
            );

    return Promise.all([
      collectionLinkUrlsPromise,
      collectionLinkAssetsPromise,
    ]).then(([collectionLinkUrls, collectionLinkAssets]) => {
      return [
        ...collectionLinkUrls.filter(notEmpty),
        ...collectionLinkAssets
          .filter(notEmpty)
          .filter((link) =>
            restrictLocale ? link.languageCode === ctx.languageCode : true
          ),
      ].sort((a, b) => a.order - b.order);
    });
  }

  async findOne(
    ctx: RequestContext,
    collectionLinkId: ID
  ): Promise<TranslatedAnyCollectionLink | undefined> {
    const collectionLink = await this.connection
      .getRepository(ctx, CollectionLink)
      .findOne({ where: { id: collectionLinkId }, loadEagerRelations: true });

    if (!collectionLink) {
      return;
    }

    let url: CollectionLinkUrl | null;
    let asset: CollectionLinkAsset | null;

    switch (collectionLink.type) {
      case "url":
        url = await this.connection
          .getRepository(ctx, CollectionLinkUrl)
          .findOne({ where: { collectionLink: { id: collectionLink.id } } });
        if (!url) {
          return;
        }

        return {
          ...collectionLink,
          ...translateDeep(url, ctx.languageCode),
          linkId: collectionLink.id,
          linkUrlId: url.id,
        };
      case "asset":
        asset = await this.connection
          .getRepository(ctx, CollectionLinkAsset)
          .findOne({ where: { collectionLink: { id: collectionLink.id } } });

        if (!asset) {
          return;
        }

        return {
          ...collectionLink,
          ...asset,
          linkId: collectionLink.id,
          linkAssetId: asset.id,
        };
      default:
        throw new Error(
          `Unsupported collection link type: ${collectionLink.type}`
        );
    }
  }

  async createUrlLink(
    ctx: RequestContext,
    input: CreateCollectionLinkUrlInput
  ): Promise<Translated<CollectionLinkUrl> & CollectionLink> {
    const collection = await assertFound(
      this.collectionService.findOne(ctx, input.collectionId)
    );

    const collectionLink = await this.connection
      .getRepository(ctx, CollectionLink)
      .save(
        new CollectionLink({
          collection,
          icon: input.icon,
          order: input.order,
          type: "url",
        })
      );

    const collectionLinkUrl = await this.translatableSaver.create({
      ctx,
      input,
      entityType: CollectionLinkUrl,
      translationType: CollectionLinkUrlTranslation,
      beforeSave: (collectionLinkUrl) => {
        //add relations
        collectionLinkUrl.collectionLink = collectionLink;
      },
    });

    return {
      ...collectionLink,
      ...translateDeep(collectionLinkUrl, ctx.languageCode),
    };
  }

  async createAssetLink(
    ctx: RequestContext,
    input: CreateCollectionLinkAssetInput
  ): Promise<CollectionLinkAsset & CollectionLink> {
    const collection = await assertFound(
      this.collectionService.findOne(ctx, input.collectionId)
    );

    const asset = await assertFound(
      this.assetService.findOne(ctx, input.assetId)
    );

    const collectionLink = await this.connection
      .getRepository(ctx, CollectionLink)
      .save(
        new CollectionLink({
          collection,
          icon: input.icon,
          order: input.order,
          type: "asset",
        })
      );

    const collectionLinkAsset = await this.connection
      .getRepository(ctx, CollectionLinkAsset)
      .save(
        new CollectionLinkAsset({
          collectionLink,
          languageCode: input.languageCode,
          asset,
        })
      );

    return {
      ...collectionLink,
      ...collectionLinkAsset,
    };
  }

  async updateUrlLink(
    ctx: RequestContext,
    input: UpdateCollectionLinkUrlInput
  ) {
    const collectionLinkUrl = await this.connection.getEntityOrThrow(
      ctx,
      CollectionLinkUrl,
      input.id
    );
    await this.translatableSaver.update({
      ctx,
      input,
      entityType: CollectionLinkUrl,
      translationType: CollectionLinkUrlTranslation,
    });

    const collectionLink = await this.connection
      .getRepository(ctx, CollectionLink)
      .save({
        id: collectionLinkUrl.collectionLinkId,
        icon: input.icon,
        order: input.order,
      });

    return assertFound(this.findOne(ctx, collectionLink.id));
  }

  async updateAssetLink(
    ctx: RequestContext,
    input: UpdateCollectionLinkAssetInput
  ) {
    const collectionLinkAsset = await this.connection.getEntityOrThrow(
      ctx,
      CollectionLinkAsset,
      input.id
    );

    const asset = await assertFound(
      this.assetService.findOne(ctx, input.assetId)
    );

    await this.connection
      .getRepository(ctx, CollectionLinkAsset)
      .save({ id: input.id, asset, languageCode: input.languageCode });

    const collectionLink = await this.connection
      .getRepository(ctx, CollectionLink)
      .save({
        id: collectionLinkAsset.collectionLinkId,
        icon: input.icon,
        order: input.order,
      });

    return assertFound(this.findOne(ctx, collectionLink.id));
  }

  async delete(
    ctx: RequestContext,
    collectionLinkId: ID
  ): Promise<DeletionResponse> {
    await this.connection
      .getRepository(ctx, CollectionLink)
      .delete(collectionLinkId);

    return {
      result: DeletionResult.DELETED,
    };
  }
}
