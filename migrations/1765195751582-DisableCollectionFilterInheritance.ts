import { MigrationInterface, QueryRunner } from "typeorm";

export class DisableCollectionFilterInheritance1765195751582
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<any> {
    // Previously we relied on a custom plugin for this functionality:
    // https://github.com/hfag/vendure-backend/blob/3a064d47166a743dd062b6efde1c3aa46e726409/src/plugins/patch-collection-filter/patch-collection-filter.ts
    await queryRunner.query(
      "UPDATE `collection` SET inheritFilters = 0",
      undefined
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
