import { DeepPartial, ID } from "@vendure/common/lib/shared-types";
import { VendureEntity, Collection } from "@vendure/core";
import { Column, Entity, ManyToOne, JoinColumn, RelationId } from "typeorm";
import { CollectionLinkUrl } from "./collection-link-url.entity";
import { CollectionLinkAsset } from "./collection-link-asset.entity";
import { Translated } from "@vendure/core/dist/common/types/locale-types";

type CollectionLinkType = "url" | "asset";

export type AnyCollectionLink = (
  | (Omit<CollectionLinkUrl, "id"> & { linkUrlId: ID })
  | (Omit<CollectionLinkAsset, "id"> & { linkAssetId: ID })
) &
  CollectionLink & { linkId: ID };

export type TranslatedAnyCollectionLink = (
  | (Omit<Translated<CollectionLinkUrl>, "id"> & { linkUrlId: ID })
  | (Omit<CollectionLinkAsset, "id"> & { linkAssetId: ID })
) &
  CollectionLink & { linkId: ID };

@Entity()
export class CollectionLink extends VendureEntity {
  constructor(input?: DeepPartial<CollectionLink>) {
    super(input);
  }

  @ManyToOne((type) => Collection, {
    onDelete: "CASCADE",
    nullable: false,
    eager: false,
  })
  @JoinColumn()
  collection: Collection;

  @RelationId((item: CollectionLink) => item.collection)
  collectionId: ID;

  @Column("varchar")
  type: CollectionLinkType;

  @Column()
  order: number;

  @Column()
  icon: string;
}
