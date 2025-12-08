import { MigrationInterface, QueryRunner } from "typeorm";

export class v0151599822499586 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `collection` DROP FOREIGN KEY `FK_7256fef1bb42f1b38156b7449f5`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_asset` DROP FOREIGN KEY `FK_0d1294f5c22a56da7845ebab72c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_asset` DROP FOREIGN KEY `FK_fa21412afac15a2304f3eb35feb`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` DROP FOREIGN KEY `FK_0e6f516053cf982b537836e21cf`",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `authentication_method` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `identifier` varchar(255) NULL, `passwordHash` varchar(255) NULL, `verificationToken` varchar(255) NULL, `passwordResetToken` varchar(255) NULL, `identifierChangeToken` varchar(255) NULL, `pendingIdentifier` varchar(255) NULL, `strategy` varchar(255) NULL, `externalIdentifier` varchar(255) NULL, `metadata` text NULL, `id` int NOT NULL AUTO_INCREMENT, `type` varchar(255) NOT NULL, `userId` int NULL, INDEX `IDX_a23445b2c942d8dfcae15b8de2` (`type`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `collection_link_url_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `url` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `collection_link_url` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `collectionLinkId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `collection_link_asset` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `collectionLinkId` int NOT NULL, `assetId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `order_channels_channel` (`orderId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_0d8e5c204480204a60e151e485` (`orderId`), INDEX `IDX_d0d16db872499e83b15999f8c7` (`channelId`), PRIMARY KEY (`orderId`, `channelId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` DROP COLUMN `passwordHash`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` DROP COLUMN `verificationToken`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` DROP COLUMN `passwordResetToken`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` DROP COLUMN `identifierChangeToken`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` DROP COLUMN `pendingIdentifier`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection` DROP COLUMN `customFieldsHaslinks`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `administrator` ADD `deletedAt` datetime NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `session` ADD `authenticationStrategy` varchar(255) NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link` ADD `icon` varchar(255) NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` DROP COLUMN `lastLogin`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` ADD `lastLogin` datetime NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `authentication_method` ADD CONSTRAINT `FK_00cbe87bc0d4e36758d61bd31d6` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection` ADD CONSTRAINT `FK_7256fef1bb42f1b38156b7449f5` FOREIGN KEY (`featuredAssetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_asset` ADD CONSTRAINT `FK_0d1294f5c22a56da7845ebab72c` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_asset` ADD CONSTRAINT `FK_fa21412afac15a2304f3eb35feb` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD CONSTRAINT `FK_0e6f516053cf982b537836e21cf` FOREIGN KEY (`featuredAssetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION",
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
      "ALTER TABLE `order_channels_channel` ADD CONSTRAINT `FK_0d8e5c204480204a60e151e4853` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_channels_channel` ADD CONSTRAINT `FK_d0d16db872499e83b15999f8c7a` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `order_channels_channel` DROP FOREIGN KEY `FK_d0d16db872499e83b15999f8c7a`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_channels_channel` DROP FOREIGN KEY `FK_0d8e5c204480204a60e151e4853`",
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
      "ALTER TABLE `product_variant` DROP FOREIGN KEY `FK_0e6f516053cf982b537836e21cf`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_asset` DROP FOREIGN KEY `FK_fa21412afac15a2304f3eb35feb`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_asset` DROP FOREIGN KEY `FK_0d1294f5c22a56da7845ebab72c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection` DROP FOREIGN KEY `FK_7256fef1bb42f1b38156b7449f5`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `authentication_method` DROP FOREIGN KEY `FK_00cbe87bc0d4e36758d61bd31d6`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` DROP COLUMN `lastLogin`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` ADD `lastLogin` varchar(255) NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link` DROP COLUMN `icon`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `session` DROP COLUMN `authenticationStrategy`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `administrator` DROP COLUMN `deletedAt`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection` ADD `customFieldsHaslinks` tinyint NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` ADD `pendingIdentifier` varchar(255) NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` ADD `identifierChangeToken` varchar(255) NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` ADD `passwordResetToken` varchar(255) NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` ADD `verificationToken` varchar(255) NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` ADD `passwordHash` varchar(255) NOT NULL",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_d0d16db872499e83b15999f8c7` ON `order_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_0d8e5c204480204a60e151e485` ON `order_channels_channel`",
      undefined
    );
    await queryRunner.query("DROP TABLE `order_channels_channel`", undefined);
    await queryRunner.query("DROP TABLE `collection_link_asset`", undefined);
    await queryRunner.query("DROP TABLE `collection_link_url`", undefined);
    await queryRunner.query(
      "DROP TABLE `collection_link_url_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_a23445b2c942d8dfcae15b8de2` ON `authentication_method`",
      undefined
    );
    await queryRunner.query("DROP TABLE `authentication_method`", undefined);
    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD CONSTRAINT `FK_0e6f516053cf982b537836e21cf` FOREIGN KEY (`featuredAssetId`) REFERENCES `asset`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_asset` ADD CONSTRAINT `FK_fa21412afac15a2304f3eb35feb` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_asset` ADD CONSTRAINT `FK_0d1294f5c22a56da7845ebab72c` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection` ADD CONSTRAINT `FK_7256fef1bb42f1b38156b7449f5` FOREIGN KEY (`featuredAssetId`) REFERENCES `asset`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "INSERT INTO `order_channels_channel` (orderId, channelId) SELECT id, 1 FROM `order`",
      undefined
    );
  }
}
