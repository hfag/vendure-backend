import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection, In } from "typeorm";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import {
  ID,
  assertFound,
  RequestContext,
  translateDeep,
  getEntityOrThrow,
  CollectionService,
} from "@vendure/core";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import { CollectionLink } from "./collection-links.entity";
import { CreateCollectionLinkInput, UpdateCollectionLinkInput } from "./index";
import { Translated } from "@vendure/core/dist/common/types/locale-types";
import { TranslatableSaver } from "@vendure/core/dist/service/helpers/translatable-saver/translatable-saver";
import { CollectionLinkTranslation } from "./collection-links-translation.entity";

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

@Injectable()
export class CollectionLinkService {
  constructor(
    @InjectConnection() private connection: Connection,
    private collectionService: CollectionService,
    private translatableSaver: TranslatableSaver
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: FindManyOptions<CollectionLink>
  ): Promise<Translated<CollectionLink>[]> {
    const collectionLinks = await this.connection
      .getRepository(CollectionLink)
      .find(options);

    return collectionLinks.map((collectionLink) =>
      translateDeep(collectionLink, ctx.languageCode)
    );
  }

  async findOne(
    ctx: RequestContext,
    collectionLinkId: ID
  ): Promise<Translated<CollectionLink> | undefined> {
    const collection = await this.connection
      .getRepository(CollectionLink)
      .findOne(collectionLinkId, { loadEagerRelations: true });

    if (!collection) {
      return;
    }

    return translateDeep(collection, ctx.languageCode);
  }

  async create(
    ctx: RequestContext,
    input: CreateCollectionLinkInput
  ): Promise<Translated<CollectionLink>> {
    const collection = await assertFound(
      this.collectionService.findOne(ctx, input.collectionId)
    );

    const collectionLink = await this.translatableSaver.create({
      input,
      entityType: CollectionLink,
      translationType: CollectionLinkTranslation,
      beforeSave: (collectionLink) => {
        //add relations
        collectionLink.collection = collection;
      },
    });

    return assertFound(this.findOne(ctx, collectionLink.id));
  }

  async createMany(
    ctx: RequestContext,
    input: CreateCollectionLinkInput[]
  ): Promise<Translated<CollectionLink>[]> {
    const collectionLinks = await Promise.all(
      input.map((collectionLinkInput) =>
        this.translatableSaver.create({
          input: collectionLinkInput,
          entityType: CollectionLink,
          translationType: CollectionLinkTranslation,
          beforeSave: async (collectionLink) => {
            //add relations
            collectionLink.collection = await assertFound(
              this.collectionService.findOne(
                ctx,
                collectionLinkInput.collectionId
              )
            );
          },
        })
      )
    );

    return this.findAll(ctx, {
      where: { id: In([collectionLinks.map((l) => l.id)]) },
    });
  }

  async update(ctx: RequestContext, input: UpdateCollectionLinkInput) {
    await getEntityOrThrow(this.connection, CollectionLink, input.id);
    const collectionLink = await this.translatableSaver.update({
      input,
      entityType: CollectionLink,
      translationType: CollectionLinkTranslation,
      beforeSave: async (collectionLink) => {
        //update relations
        if (input.collectionId) {
          collectionLink.collection = await assertFound(
            this.collectionService.findOne(ctx, input.collectionId)
          );
        }
      },
    });

    return assertFound(this.findOne(ctx, collectionLink.id));
  }

  async updateMany(ctx: RequestContext, input: UpdateCollectionLinkInput[]) {
    const collectionLinks = (
      await Promise.all(
        input.map((collectionLinkInput) =>
          getEntityOrThrow(
            this.connection,
            CollectionLink,
            collectionLinkInput.id
          )
            .then(() =>
              this.translatableSaver.update({
                input: collectionLinkInput,
                entityType: CollectionLink,
                translationType: CollectionLinkTranslation,
                beforeSave: async (collectionLink) => {
                  //update relations
                  if (collectionLinkInput.collectionId) {
                    collectionLink.collection = await assertFound(
                      this.collectionService.findOne(
                        ctx,
                        collectionLinkInput.collectionId
                      )
                    );
                  }
                },
              })
            )
            .catch(() => null)
        )
      )
    ).filter(notEmpty);

    return this.findAll(ctx, {
      where: { id: In([collectionLinks.map((l) => l.id)]) },
    });
  }

  async delete(collectionLinkId: ID): Promise<DeletionResponse> {
    await this.connection
      .getRepository(CollectionLinkTranslation)
      .remove(
        await this.connection
          .getRepository(CollectionLinkTranslation)
          .find({ where: { base: { id: collectionLinkId } } })
      );
    await this.connection
      .getRepository(CollectionLink)
      .delete(collectionLinkId);

    return {
      result: DeletionResult.DELETED,
    };
  }

  async deleteMany(collectionLinkIds: ID[]): Promise<DeletionResponse> {
    await Promise.all(
      collectionLinkIds.map((id) =>
        this.connection.getRepository(CollectionLink).delete(id)
      )
    );

    return {
      result: DeletionResult.DELETED,
    };
  }
}
