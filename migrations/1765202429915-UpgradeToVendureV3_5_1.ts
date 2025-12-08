import { MigrationInterface, QueryRunner } from "typeorm";

export class UpgradeToVendureV3511765202429915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // This foreign key was somehow messed up
    await queryRunner.query(
      "ALTER TABLE `order_modification` DROP FOREIGN KEY FK_1df5bc14a47ef24d2e681f45598",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` ADD CONSTRAINT `FK_1df5bc14a47ef24d2e681f45598` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    // We need to drop the foreign key to drop the associated index
    await queryRunner.query(
      "ALTER TABLE `order_modification` DROP FOREIGN KEY FK_ad2991fa2933ed8b7f86a716338",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `REL_ad2991fa2933ed8b7f86a71633` ON `order_modification`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` ADD CONSTRAINT `FK_ad2991fa2933ed8b7f86a716338` FOREIGN KEY (`paymentId`) REFERENCES `payment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );

    // We need to drop the foreign key to drop the associated index
    await queryRunner.query(
      "ALTER TABLE `order_modification` DROP FOREIGN KEY FK_cb66b63b6e97613013795eadbd5",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `REL_cb66b63b6e97613013795eadbd` ON `order_modification`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` ADD CONSTRAINT `FK_cb66b63b6e97613013795eadbd5` FOREIGN KEY (`refundId`) REFERENCES `refund`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "CREATE TABLE `settings_store_entry` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `key` varchar(255) NOT NULL, `value` json NULL, `scope` varchar(255) NULL, `id` int NOT NULL AUTO_INCREMENT, INDEX `IDX_ab560f7983976aec91b91c26a4` (`key`), INDEX `IDX_8d8ddb95a0fbd11ffb5606ef0c` (`scope`), UNIQUE INDEX `settings_store_key_scope_unique` (`key`, `scope`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_af13739f4962eab899bdff34be` ON `order` (`orderPlacedAt`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_86bc376c56af8cefd41a847a95` ON `job_record` (`createdAt`)",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DROP INDEX `IDX_86bc376c56af8cefd41a847a95` ON `job_record`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_af13739f4962eab899bdff34be` ON `order`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `settings_store_key_scope_unique` ON `settings_store_entry`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_8d8ddb95a0fbd11ffb5606ef0c` ON `settings_store_entry`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_ab560f7983976aec91b91c26a4` ON `settings_store_entry`",
      undefined
    );
    await queryRunner.query("DROP TABLE `settings_store_entry`", undefined);

    // We need to drop the foreign key to drop the associated index
    await queryRunner.query(
      "ALTER TABLE `order_modification` DROP FOREIGN KEY `FK_1df5bc14a47ef24d2e681f45598`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `REL_1df5bc14a47ef24d2e681f45598` ON `order_modification`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` ADD CONSTRAINT `FK_1df5bc14a47ef24d2e681f45598` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    // We need to drop the foreign key to drop the associated index
    await queryRunner.query(
      "ALTER TABLE `order_modification` DROP FOREIGN KEY FK_ad2991fa2933ed8b7f86a716338",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `REL_ad2991fa2933ed8b7f86a71633` ON `order_modification`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` ADD CONSTRAINT `FK_ad2991fa2933ed8b7f86a716338` FOREIGN KEY (`paymentId`) REFERENCES `payment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );

    // We need to drop the foreign key to drop the associated index
    await queryRunner.query(
      "ALTER TABLE `order_modification` DROP FOREIGN KEY FK_cb66b63b6e97613013795eadbd5",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `REL_cb66b63b6e97613013795eadbd` ON `order_modification`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` ADD CONSTRAINT `FK_cb66b63b6e97613013795eadbd5` FOREIGN KEY (`refundId`) REFERENCES `refund`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
  }
}
