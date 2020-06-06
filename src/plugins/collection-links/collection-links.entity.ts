import { DeepPartial, ID } from "@vendure/common/lib/shared-types";
import { VendureEntity, Product, Collection } from "@vendure/core";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import {
  Translatable,
  LocaleString,
  Translation,
} from "@vendure/core/dist/common/types/locale-types";
import { CollectionLinkTranslation } from "./collection-links-translation.entity";

@Entity()
export class CollectionLink extends VendureEntity implements Translatable {
  constructor(input?: DeepPartial<CollectionLink>) {
    super(input);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Collection, {
    onDelete: "CASCADE",
    nullable: false,
    eager: false,
  })
  @JoinColumn()
  collection: Collection;

  @RelationId((item: CollectionLink) => item.collection)
  collectionId: ID;

  @Column()
  type: string;

  @OneToMany(
    (type) => CollectionLinkTranslation,
    (translation) => translation.base,
    { eager: true }
  )
  translations: Array<Translation<CollectionLink>>;

  name: LocaleString;

  url: LocaleString;
}
