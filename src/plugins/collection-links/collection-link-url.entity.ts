import { DeepPartial, ID } from "@vendure/common/lib/shared-types";
import { VendureEntity, Product, Collection } from "@vendure/core";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  RelationId,
} from "typeorm";
import {
  Translatable,
  LocaleString,
  Translation,
} from "@vendure/core/dist/common/types/locale-types";
import { CollectionLinkUrlTranslation } from "./collection-link-url-translation.entity";
import { CollectionLink } from "./collection-link.entity";

@Entity()
export class CollectionLinkUrl extends VendureEntity implements Translatable {
  constructor(input?: DeepPartial<CollectionLinkUrl>) {
    super(input);
  }

  @ManyToOne((type) => CollectionLink, {
    onDelete: "CASCADE",
    nullable: false,
    eager: false,
  })
  @JoinColumn()
  collectionLink: CollectionLink;

  @RelationId((item: CollectionLinkUrl) => item.collectionLink)
  collectionLinkId: ID;

  @OneToMany(
    (type) => CollectionLinkUrlTranslation,
    (translation) => translation.base,
    { eager: true }
  )
  translations: Array<Translation<CollectionLinkUrl>>;

  name: LocaleString;

  url: LocaleString;
}
