import { LanguageCode } from "@vendure/common/lib/generated-types";
import { DeepPartial, ID } from "@vendure/common/lib/shared-types";
import { Column, Entity, Index, ManyToOne, RelationId } from "typeorm";

import { CollectionLink } from "./collection-links.entity";
import { VendureEntity } from "@vendure/core";
import { Translation } from "@vendure/core/dist/common/types/locale-types";

@Entity()
export class CollectionLinkTranslation extends VendureEntity
  implements Translation<CollectionLink> {
  constructor(input?: DeepPartial<Translation<CollectionLink>>) {
    super(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne((type) => CollectionLink, (base) => base.translations)
  base: CollectionLink;

  @RelationId((item: CollectionLinkTranslation) => item.base)
  baseId: ID;
}
