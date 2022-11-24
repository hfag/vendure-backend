import { DeepPartial, ID } from "@vendure/common/lib/shared-types";
import { VendureEntity, LanguageCode, Asset } from "@vendure/core";
import { Column, Entity, ManyToOne, JoinColumn, RelationId } from "typeorm";

import { CollectionLink } from "./collection-link.entity";

@Entity()
export class CollectionLinkAsset extends VendureEntity {
  constructor(input?: DeepPartial<CollectionLinkAsset>) {
    super(input);
  }

  @ManyToOne(() => CollectionLink, {
    onDelete: "CASCADE",
    nullable: false,
    eager: false,
  })
  @JoinColumn()
  collectionLink: CollectionLink;

  @RelationId((item: CollectionLinkAsset) => item.collectionLink)
  collectionLinkId: ID;

  @Column("varchar")
  languageCode: LanguageCode;

  @ManyToOne(() => Asset, {
    onDelete: "CASCADE",
    nullable: false,
    eager: false,
  })
  @JoinColumn()
  asset: Asset;

  @RelationId((item: CollectionLinkAsset) => item.asset)
  assetId: ID;
}
