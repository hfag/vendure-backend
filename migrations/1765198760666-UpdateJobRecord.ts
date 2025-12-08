import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobRecord1765198760666 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Destructive: Truncates the text to fit into a 'text' column
    await queryRunner.query(
      "UPDATE `job_record` SET `data` = SUBSTRING(`data`, 1, 60000) WHERE LENGTH(`data`) > 65535;",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `job_record` MODIFY `data` text NULL;",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `job_record` MODIFY `data` longtext COLLATE "utf8mb4_general_ci" NULL;',
      undefined
    );
  }
}
