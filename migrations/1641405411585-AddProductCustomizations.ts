import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductCustomizations1641405411585
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `product` ADD `customFieldsCustomizationoptions` TEXT NULL",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `product` DROP COLUMN `customFieldsCustomizationoptions`",
      undefined
    );
  }
}
