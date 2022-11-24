import { LanguageCode } from "@vendure/common/lib/generated-types";
import { DeepPartial, ID } from "@vendure/common/lib/shared-types";
import { VendureEntity } from "@vendure/core";
import { Translation } from "@vendure/core/dist/common/types/locale-types";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";

import { CollectionLinkUrl } from "./collection-link-url.entity";

@Entity()
export class CollectionLinkUrlTranslation
  extends VendureEntity
  implements Translation<CollectionLinkUrl>
{
  constructor(input?: DeepPartial<Translation<CollectionLinkUrl>>) {
    super(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => CollectionLinkUrl, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: CollectionLinkUrl;

  @RelationId((item: CollectionLinkUrlTranslation) => item.base)
  baseId: ID;
}
