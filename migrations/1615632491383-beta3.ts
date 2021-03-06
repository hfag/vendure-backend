import { MigrationInterface, QueryRunner } from "typeorm";
import { addToDefaultChannel, migratePaymentMethods } from "../migration-utils";

export class beta31615632491383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TABLE `tag` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `value` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `asset_tags_tag` (`assetId` int NOT NULL, `tagId` int NOT NULL, INDEX `IDX_9e412b00d4c6cee1a4b3d92071` (`assetId`), INDEX `IDX_fb5e800171ffbe9823f2cc727f` (`tagId`), PRIMARY KEY (`assetId`, `tagId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `asset_channels_channel` (`assetId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_dc4e7435f9f5e9e6436bebd33b` (`assetId`), INDEX `IDX_16ca9151a5153f1169da5b7b7e` (`channelId`), PRIMARY KEY (`assetId`, `channelId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `facet_channels_channel` (`facetId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_ca796020c6d097e251e5d6d2b0` (`facetId`), INDEX `IDX_2a8ea404d05bf682516184db7d` (`channelId`), PRIMARY KEY (`facetId`, `channelId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `facet_value_channels_channel` (`facetValueId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_ad690c1b05596d7f52e52ffeed` (`facetValueId`), INDEX `IDX_e1d54c0b9db3e2eb17faaf5919` (`channelId`), PRIMARY KEY (`facetValueId`, `channelId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `payment_method_channels_channel` (`paymentMethodId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_5bcb569635ce5407eb3f264487` (`paymentMethodId`), INDEX `IDX_c00e36f667d35031087b382e61` (`channelId`), PRIMARY KEY (`paymentMethodId`, `channelId`)) ENGINE=InnoDB",
      undefined
    );

    // Group all the "payment_method" queries and ensure the DROP COLUMN is at the end
    // _after_ the new columns have been added and the migratePaymentMethods() funtion has been run.
    await queryRunner.query(
      "ALTER TABLE `payment_method` ADD `name` varchar(255) NOT NULL DEFAULT ''",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method` ADD `description` varchar(255) NOT NULL DEFAULT ''",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method` ADD `checker` text NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method` ADD `handler` text NOT NULL",
      undefined
    );
    await migratePaymentMethods(queryRunner);
    await queryRunner.query(
      "ALTER TABLE `payment_method` DROP COLUMN `configArgs`",
      undefined
    );

    //
    await queryRunner.query(
      "ALTER TABLE `product_option_group` ADD `deletedAt` datetime NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option` ADD `deletedAt` datetime NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `tax_category` ADD `isDefault` tinyint NOT NULL DEFAULT 0",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `initialListPrice` int NULL",
      undefined
    );

    //
    await queryRunner.query(
      "ALTER TABLE `payment_method` CHANGE `code` `code` varchar(255) NOT NULL DEFAULT ''",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_tags_tag` ADD CONSTRAINT `FK_9e412b00d4c6cee1a4b3d920716` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_tags_tag` ADD CONSTRAINT `FK_fb5e800171ffbe9823f2cc727fd` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_channels_channel` ADD CONSTRAINT `FK_dc4e7435f9f5e9e6436bebd33bb` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_channels_channel` ADD CONSTRAINT `FK_16ca9151a5153f1169da5b7b7e3` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_channels_channel` ADD CONSTRAINT `FK_ca796020c6d097e251e5d6d2b02` FOREIGN KEY (`facetId`) REFERENCES `facet`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_channels_channel` ADD CONSTRAINT `FK_2a8ea404d05bf682516184db7d3` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` ADD CONSTRAINT `FK_ad690c1b05596d7f52e52ffeedd` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` ADD CONSTRAINT `FK_e1d54c0b9db3e2eb17faaf5919c` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` ADD CONSTRAINT `FK_5bcb569635ce5407eb3f264487d` FOREIGN KEY (`paymentMethodId`) REFERENCES `payment_method`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` ADD CONSTRAINT `FK_c00e36f667d35031087b382e61b` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    //
    await addToDefaultChannel(queryRunner, "asset", "assetId");
    await addToDefaultChannel(queryRunner, "facet", "facetId");
    await addToDefaultChannel(queryRunner, "facet_value", "facetValueId");
    await addToDefaultChannel(queryRunner, "payment_method", "paymentMethodId");

    await queryRunner.query(
      "ALTER TABLE `country_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `country` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `zone` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `role` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `authentication_method` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_asset` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_asset` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_group_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_group` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `tax_category` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_asset` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_price` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `address` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `fulfillment` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `refund` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `lineId` `lineId` int NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `surcharge` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_line` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_group` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `tax_rate` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `administrator` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `session` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `global_settings` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `history_entry` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_recommendation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_discount` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_asset` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` DROP FOREIGN KEY `FK_c00e36f667d35031087b382e61b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` DROP FOREIGN KEY `FK_5bcb569635ce5407eb3f264487d`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` DROP FOREIGN KEY `FK_e1d54c0b9db3e2eb17faaf5919c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` DROP FOREIGN KEY `FK_ad690c1b05596d7f52e52ffeedd`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_channels_channel` DROP FOREIGN KEY `FK_2a8ea404d05bf682516184db7d3`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_channels_channel` DROP FOREIGN KEY `FK_ca796020c6d097e251e5d6d2b02`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_channels_channel` DROP FOREIGN KEY `FK_16ca9151a5153f1169da5b7b7e3`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_channels_channel` DROP FOREIGN KEY `FK_dc4e7435f9f5e9e6436bebd33bb`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_tags_tag` DROP FOREIGN KEY `FK_fb5e800171ffbe9823f2cc727fd`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_tags_tag` DROP FOREIGN KEY `FK_9e412b00d4c6cee1a4b3d920716`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_asset` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link_url_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_link` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `bulk_discount` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_recommendation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `history_entry` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `global_settings` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `session` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method` CHANGE `code` `code` varchar(255) NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `administrator` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `tax_rate` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_group` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_line` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `surcharge` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `lineId` `lineId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `refund` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `fulfillment` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `address` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_price` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_asset` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `tax_category` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_group` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_group_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_asset` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_asset` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `authentication_method` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `role` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `zone` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `country` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `country_translation` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method` DROP COLUMN `handler`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method` DROP COLUMN `checker`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method` DROP COLUMN `description`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method` DROP COLUMN `name`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` DROP COLUMN `initialListPrice`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `tax_category` DROP COLUMN `isDefault`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option` DROP COLUMN `deletedAt`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_group` DROP COLUMN `deletedAt`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method` ADD `configArgs` text NOT NULL",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_c00e36f667d35031087b382e61` ON `payment_method_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_5bcb569635ce5407eb3f264487` ON `payment_method_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP TABLE `payment_method_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_e1d54c0b9db3e2eb17faaf5919` ON `facet_value_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_ad690c1b05596d7f52e52ffeed` ON `facet_value_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP TABLE `facet_value_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_2a8ea404d05bf682516184db7d` ON `facet_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_ca796020c6d097e251e5d6d2b0` ON `facet_channels_channel`",
      undefined
    );
    await queryRunner.query("DROP TABLE `facet_channels_channel`", undefined);
    await queryRunner.query(
      "DROP INDEX `IDX_16ca9151a5153f1169da5b7b7e` ON `asset_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_dc4e7435f9f5e9e6436bebd33b` ON `asset_channels_channel`",
      undefined
    );
    await queryRunner.query("DROP TABLE `asset_channels_channel`", undefined);
    await queryRunner.query(
      "DROP INDEX `IDX_fb5e800171ffbe9823f2cc727f` ON `asset_tags_tag`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_9e412b00d4c6cee1a4b3d92071` ON `asset_tags_tag`",
      undefined
    );
    await queryRunner.query("DROP TABLE `asset_tags_tag`", undefined);
    await queryRunner.query("DROP TABLE `tag`", undefined);
  }
}
