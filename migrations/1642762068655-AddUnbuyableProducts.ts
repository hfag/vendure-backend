import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnbuyableProducts1642762068655 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `product` ADD `customFieldsBuyable` tinyint NULL DEFAULT 1",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `product` DROP COLUMN `customFieldsBuyable`",
      undefined
    );
  }
}
