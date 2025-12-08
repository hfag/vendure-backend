import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomPlugins1765198391883 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `collection_link` DROP FOREIGN KEY `FK_9cc7affb128504e1acf9c812e15`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_asset` DROP FOREIGN KEY `FK_89bfdeca71db0ae8577cc865ca9`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_asset` DROP FOREIGN KEY `FK_c19a1f1df560a5d5c367e7f9645`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url` DROP FOREIGN KEY `FK_4699875ee0ac96678e9bae558dc`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url_translation` DROP FOREIGN KEY `FK_1bd4b6024a48a1d441e3bdb1ee7`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_discount` DROP FOREIGN KEY `FK_e6f355ef008f063dfb6cb1e9875`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product` MODIFY `customFieldsCustomizationoptions` longtext NULL;",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` MODIFY `customFieldsCustomizations` longtext NULL;",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url_translation` CHANGE `baseId` `baseId` int NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link` ADD CONSTRAINT `FK_9cc7affb128504e1acf9c812e15` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_asset` ADD CONSTRAINT `FK_c19a1f1df560a5d5c367e7f9645` FOREIGN KEY (`collectionLinkId`) REFERENCES `collection_link`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_asset` ADD CONSTRAINT `FK_89bfdeca71db0ae8577cc865ca9` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url` ADD CONSTRAINT `FK_4699875ee0ac96678e9bae558dc` FOREIGN KEY (`collectionLinkId`) REFERENCES `collection_link`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url_translation` ADD CONSTRAINT `FK_1bd4b6024a48a1d441e3bdb1ee7` FOREIGN KEY (`baseId`) REFERENCES `collection_link_url`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_discount` ADD CONSTRAINT `FK_e6f355ef008f063dfb6cb1e9875` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `bulk_discount` DROP FOREIGN KEY `FK_e6f355ef008f063dfb6cb1e9875`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url_translation` DROP FOREIGN KEY `FK_1bd4b6024a48a1d441e3bdb1ee7`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url` DROP FOREIGN KEY `FK_4699875ee0ac96678e9bae558dc`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_asset` DROP FOREIGN KEY `FK_89bfdeca71db0ae8577cc865ca9`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_asset` DROP FOREIGN KEY `FK_c19a1f1df560a5d5c367e7f9645`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link` DROP FOREIGN KEY `FK_9cc7affb128504e1acf9c812e15`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url_translation` CHANGE `baseId` `baseId` int NULL",
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` MODIFY `customFieldsCustomizations` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NULL;',
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product` MODIFY `customFieldsCustomizationoptions` text NULL;",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_discount` ADD CONSTRAINT `FK_e6f355ef008f063dfb6cb1e9875` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url_translation` ADD CONSTRAINT `FK_1bd4b6024a48a1d441e3bdb1ee7` FOREIGN KEY (`baseId`) REFERENCES `collection_link_url`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url` ADD CONSTRAINT `FK_4699875ee0ac96678e9bae558dc` FOREIGN KEY (`collectionLinkId`) REFERENCES `collection_link`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_asset` ADD CONSTRAINT `FK_c19a1f1df560a5d5c367e7f9645` FOREIGN KEY (`collectionLinkId`) REFERENCES `collection_link`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_asset` ADD CONSTRAINT `FK_89bfdeca71db0ae8577cc865ca9` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link` ADD CONSTRAINT `FK_9cc7affb128504e1acf9c812e15` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
  }
}
