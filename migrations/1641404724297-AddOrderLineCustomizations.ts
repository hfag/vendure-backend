import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderLineCustomizations1641404724297
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD `customFieldsCustomizations` varchar(255) NULL",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP COLUMN `customFieldsCustomizations`",
      undefined
    );
  }
}
