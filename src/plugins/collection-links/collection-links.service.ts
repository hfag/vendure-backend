import { Injectable } from "@nestjs/common";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import {
  ID,
  assertFound,
  RequestContext,
  translateDeep,
  getEntityOrThrow,
  CollectionService,
  AssetService,
  TransactionalConnection,
} from "@vendure/core";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import {
  CollectionLink,
  TranslatedAnyCollectionLink,
} from "./collection-link.entity";
import { CollectionLinkUrl } from "./collection-link-url.entity";
import { CollectionLinkAsset } from "./collection-link-asset.entity";
import { CollectionLinkUrlTranslation } from "./collection-link-url-translation.entity";
import {
  CreateCollectionLinkUrlInput,
  CreateCollectionLinkAssetInput,
  UpdateCollectionLinkUrlInput,
  UpdateCollectionLinkAssetInput,
  UpdateCollectionLinkInput,
} from "./index";
import { Translated } from "@vendure/core/dist/common/types/locale-types";
import { TranslatableSaver } from "@vendure/core/dist/service/helpers/translatable-saver/translatable-saver";

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
      .getRepository(CollectionLink)
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
            .getRepository(CollectionLinkUrl)
            .find({
              where: urlLinks.map((collectionLink) => ({ collectionLink })),
            })
            .then((links) =>
              links.map((urlLink) => {
                const collectionLink = urlLinks.find(
                  (l) => l.id == urlLink.collectionLinkId
                )!;

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
            .getRepository(CollectionLinkAsset)
            .find({
              where: assetLinks.map((collectionLink) => ({ collectionLink })),
            })
            .then((links) =>
              links.map((assetLink) => {
                const collectionLink = assetLinks.find(
                  (l) => l.id == assetLink.collectionLinkId
                )!;

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
      .getRepository(CollectionLink)
      .findOne(collectionLinkId, { loadEagerRelations: true });

    if (!collectionLink) {
      return;
    }

    switch (collectionLink.type) {
      case "url":
        const url = await this.connection
          .getRepository(CollectionLinkUrl)
          .findOne({ where: { collectionLinkId: collectionLink.id } });
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
        const asset = await this.connection
          .getRepository(CollectionLinkAsset)
          .findOne({ where: { collectionLinkId: collectionLink.id } });
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
      .getRepository(CollectionLink)
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
      .getRepository(CollectionLink)
      .save(
        new CollectionLink({
          collection,
          icon: input.icon,
          order: input.order,
          type: "asset",
        })
      );

    const collectionLinkAsset = await this.connection
      .getRepository(CollectionLinkAsset)
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
    const updatedCollectionLinkUrl = await this.translatableSaver.update({
      ctx,
      input,
      entityType: CollectionLinkUrl,
      translationType: CollectionLinkUrlTranslation,
    });

    const collectionLink = await this.connection
      .getRepository(CollectionLink)
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
    const collectionLinkAsset = await getEntityOrThrow(
      this.connection,
      CollectionLinkAsset,
      input.id
    );

    const asset = await assertFound(
      this.assetService.findOne(ctx, input.assetId)
    );

    const collectionLinkAssetUpdate = await this.connection
      .getRepository(CollectionLinkAsset)
      .save({ id: input.id, asset, languageCode: input.languageCode });

    const collectionLink = await this.connection
      .getRepository(CollectionLink)
      .save({
        id: collectionLinkAsset.collectionLinkId,
        icon: input.icon,
        order: input.order,
      });

    return assertFound(this.findOne(ctx, collectionLink.id));
  }

  async delete(collectionLinkId: ID): Promise<DeletionResponse> {
    await this.connection
      .getRepository(CollectionLink)
      .delete(collectionLinkId);

    return {
      result: DeletionResult.DELETED,
    };
  }
}
