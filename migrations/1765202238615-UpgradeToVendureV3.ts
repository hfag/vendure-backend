import { MigrationInterface, QueryRunner } from "typeorm";

export class UpgradeToVendureV31765202238615 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DROP INDEX `IDX_94e15d5f12d355d117390131ac` ON `stock_movement`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_e5598363000cab9d9116bd5835` ON `session`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_f3a761f6bcfabb474b11e1e51f` ON `history_entry`",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE INDEX `IDX_f3a761f6bcfabb474b11e1e51f` ON `history_entry` (`discriminator`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_e5598363000cab9d9116bd5835` ON `session` (`type`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_94e15d5f12d355d117390131ac` ON `stock_movement` (`discriminator`)",
      undefined
    );
  }
}
