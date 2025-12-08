import { vendureV2Migrations } from "@vendure/migrate-v2";
import { MigrationInterface, QueryRunner } from "typeorm";

export class UpgradeToVendureV21765189328303 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `product_option_translation` DROP FOREIGN KEY `FK_a79a443c1f7841f3851767faa6d`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_group_translation` DROP FOREIGN KEY `FK_93751abc1451972c02e033b766c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` DROP FOREIGN KEY `FK_cbb0990e398bf7713aebdd38482`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_price` DROP FOREIGN KEY `FK_e6126cd268aea6e9b31d89af9ab`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_translation` DROP FOREIGN KEY `FK_420f4d6fb75d38b9dca79bc43b4`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_translation` DROP FOREIGN KEY `FK_85ec26c71067ebc84adcd98d1a5`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_line` DROP FOREIGN KEY `FK_c9f34a440d490d1b66f6829b86c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `address` DROP FOREIGN KEY `FK_d87215343c3a3a67e6a0b7f3ea9`",
      undefined
    );

    // =================== Step 1 ===================
    // TypeORM will generate this RENAME COLUMN statement, but we should be creating a new column and dropping the old one.
    // Comment out the following query:
    //     await queryRunner.query(
    //       "ALTER TABLE `stock_movement` CHANGE `orderItemId` `stockLocationId` int NULL",
    //       undefined
    //     );

    // Replace it with the line below if you are using the default value (AutoIncrementIdStrategy) for the entityIdStrategy:
    await queryRunner.query(
      "ALTER TABLE `stock_movement` ADD `stockLocationId` int"
    );

    await queryRunner.query(
      "CREATE TABLE `seller` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `name` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `region_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, INDEX `IDX_1afd722b943c81310705fc3e61` (`baseId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `region` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `code` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `enabled` tinyint NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `parentId` int NULL, `discriminator` varchar(255) NOT NULL, INDEX `IDX_ed0c8098ce6809925a437f42ae` (`parentId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `stock_location` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `stock_level` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `stockOnHand` int NOT NULL, `stockAllocated` int NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `productVariantId` int NOT NULL, `stockLocationId` int NOT NULL, INDEX `IDX_9950eae3180f39c71978748bd0` (`productVariantId`), INDEX `IDX_984c48572468c69661a0b7b049` (`stockLocationId`), UNIQUE INDEX `IDX_7fc20486b8cfd33dc84c96e168` (`productVariantId`, `stockLocationId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `order_line_reference` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `quantity` int NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `fulfillmentId` int NULL, `modificationId` int NULL, `orderLineId` int NOT NULL, `refundId` int NULL, `discriminator` varchar(255) NOT NULL, INDEX `IDX_7d57857922dfc7303604697dbe` (`orderLineId`), INDEX `IDX_06b02fb482b188823e419d37bd` (`fulfillmentId`), INDEX `IDX_22b818af8722746fb9f206068c` (`modificationId`), INDEX `IDX_30019aa65b17fe9ee962893199` (`refundId`), INDEX `IDX_49a8632be8cef48b076446b8b9` (`discriminator`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `promotion_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `description` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, INDEX `IDX_1cc009e9ab2263a35544064561` (`baseId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `payment_method_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `description` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, INDEX `IDX_66187f782a3e71b9e0f5b50b68` (`baseId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `zone_members_region` (`zoneId` int NOT NULL, `regionId` int NOT NULL, INDEX `IDX_433f45158e4e2b2a2f344714b2` (`zoneId`), INDEX `IDX_b45b65256486a15a104e17d495` (`regionId`), PRIMARY KEY (`zoneId`, `regionId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `stock_location_channels_channel` (`stockLocationId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_39513fd02a573c848d23bee587` (`stockLocationId`), INDEX `IDX_ff8150fe54e56a900d5712671a` (`channelId`), PRIMARY KEY (`stockLocationId`, `channelId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `order_fulfillments_fulfillment` (`orderId` int NOT NULL, `fulfillmentId` int NOT NULL, INDEX `IDX_f80d84d525af2ffe974e7e8ca2` (`orderId`), INDEX `IDX_4add5a5796e1582dec2877b289` (`fulfillmentId`), PRIMARY KEY (`orderId`, `fulfillmentId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `collection_closure` (`id_ancestor` int NOT NULL, `id_descendant` int NOT NULL, INDEX `IDX_c309f8cd152bbeaea08491e0c6` (`id_ancestor`), INDEX `IDX_457784c710f8ac9396010441f6` (`id_descendant`), PRIMARY KEY (`id_ancestor`, `id_descendant`)) ENGINE=InnoDB",
      undefined
    );

    // ==================== Step 2 ====================
    // Comment out the following "DROP COLUMN" queries. We still require these columns for the migration
    // of existing data, and will drop them in a later step.
    //     await queryRunner.query(
    //       "ALTER TABLE `channel` DROP COLUMN `currencyCode`",
    //       undefined
    //     );
    //     await queryRunner.query(
    //       "ALTER TABLE `product_variant` DROP COLUMN `stockAllocated`",
    //       undefined
    //     );
    //     await queryRunner.query(
    //       "ALTER TABLE `product_variant` DROP COLUMN `stockOnHand`",
    //       undefined
    //     );
    //     await queryRunner.query(
    //       "ALTER TABLE `promotion` DROP COLUMN `name`",
    //       undefined
    //     );
    //     await queryRunner.query(
    //       "ALTER TABLE `payment_method` DROP COLUMN `description`",
    //       undefined
    //     );
    //     await queryRunner.query(
    //       "ALTER TABLE `payment_method` DROP COLUMN `name`",
    //       undefined
    //     );

    // ==================== Step 3 (optional) ====================
    // If you do not have custom fields defined which link to custom entities
    // (i.e. have the type: "relation"), skip to the next step.
    // We do not -> skip.

    await queryRunner.query(
      "ALTER TABLE `channel` ADD `description` varchar(255) NULL DEFAULT ''",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` ADD `availableLanguageCodes` text NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` ADD `defaultCurrencyCode` varchar(255) NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` ADD `availableCurrencyCodes` text NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` ADD `trackInventory` tinyint NOT NULL DEFAULT 1",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` ADD `outOfStockThreshold` int NOT NULL DEFAULT '0'",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` ADD `sellerId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection` ADD `inheritFilters` tinyint NOT NULL DEFAULT 1",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_price` ADD `currencyCode` varchar(255) NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD `quantity` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD `orderPlacedQuantity` int NOT NULL DEFAULT '0'",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD `listPriceIncludesTax` tinyint NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD `adjustments` text NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD `taxLines` text NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD `sellerChannelId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD `shippingLineId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD `initialListPrice` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD `listPrice` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` ADD `type` varchar(255) NOT NULL DEFAULT 'Regular'",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` ADD `aggregateOrderId` int NULL",
      undefined
    );
    // Since it was not possible to configure the type to be 'Text' manually, this was done
    // directly on the databse. Should be fixed after the upgrade to 3.0.
    //     await queryRunner.query(
    //       "ALTER TABLE `product` DROP COLUMN `customFieldsCustomizationoptions`",
    //       undefined
    //     );
    //     await queryRunner.query(
    //       "ALTER TABLE `product` ADD `customFieldsCustomizationoptions` varchar(255) NULL",
    //       undefined
    //     );
    await queryRunner.query(
      "ALTER TABLE `product_variant_price` CHANGE `channelId` `channelId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP FOREIGN KEY `FK_cbcd22193eda94668e84d33f185`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` CHANGE `productVariantId` `productVariantId` int NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` CHANGE `code` `code` varchar(255) NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` ADD UNIQUE INDEX `IDX_729b3eea7ce540930dbb706949` (`code`)",
      undefined
    );
    // For job_record, the type was manually changed to 'longText'.
    // Should be fixed after the upgrade to 3.0.
    //     await queryRunner.query(
    //       "ALTER TABLE `job_record` DROP COLUMN `data`",
    //       undefined
    //     );
    //     await queryRunner.query(
    //       "ALTER TABLE `job_record` ADD `data` text NULL",
    //       undefined
    //     );
    await queryRunner.query(
      "CREATE INDEX `IDX_00cbe87bc0d4e36758d61bd31d` ON `authentication_method` (`userId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_af2116c7e176b6b88dceceeb74` ON `channel` (`sellerId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_afe9f917a1c82b9e9e69f7c612` ON `channel` (`defaultTaxZoneId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_c9ca2f58d4517460435cbd8b4c` ON `channel` (`defaultShippingZoneId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_51da53b26522dc0525762d2de8` ON `collection_asset` (`assetId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_1ed9e48dfbf74b5fcbb35d3d68` ON `collection_asset` (`collectionId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_9f9da7d94b0278ea0f7831e1fc` ON `collection_translation` (`slug`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_e329f9036210d75caa1d8f2154` ON `collection_translation` (`baseId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_7256fef1bb42f1b38156b7449f` ON `collection` (`featuredAssetId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_eaea53f44bf9e97790d38a3d68` ON `facet_translation` (`baseId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_3d6e45823b65de808a66cb1423` ON `facet_value_translation` (`baseId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_d101dc2265a7341be3d94968c5` ON `facet_value` (`facetId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_a79a443c1f7841f3851767faa6` ON `product_option_translation` (`baseId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_a6debf9198e2fbfa006aa10d71` ON `product_option` (`groupId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_93751abc1451972c02e033b766` ON `product_option_group_translation` (`baseId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_a6e91739227bf4d442f23c52c7` ON `product_option_group` (`productId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_5888ac17b317b93378494a1062` ON `product_asset` (`assetId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_0d1294f5c22a56da7845ebab72` ON `product_asset` (`productId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_f4a2ec16ba86d277b6faa0b67b` ON `product_translation` (`slug`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_7dbc75cb4e8b002620c4dbfdac` ON `product_translation` (`baseId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_91a19e6613534949a4ce6e76ff` ON `product` (`featuredAssetId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_e65ba3882557cab4febb54809b` ON `stock_movement` (`productVariantId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_a2fe7172eeae9f1cca86f8f573` ON `stock_movement` (`stockLocationId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_d2c8d5fca981cc820131f81aa8` ON `stock_movement` (`orderLineId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_10b5a2e3dee0e30b1e26c32f5c` ON `product_variant_asset` (`assetId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_fa21412afac15a2304f3eb35fe` ON `product_variant_asset` (`productVariantId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_e6126cd268aea6e9b31d89af9a` ON `product_variant_price` (`variantId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_420f4d6fb75d38b9dca79bc43b` ON `product_variant_translation` (`baseId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_0e6f516053cf982b537836e21c` ON `product_variant` (`featuredAssetId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_e38dca0d82fd64c7cf8aac8b8e` ON `product_variant` (`taxCategoryId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_6e420052844edf3a5506d863ce` ON `product_variant` (`productId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_85ec26c71067ebc84adcd98d1a` ON `shipping_method_translation` (`baseId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_e2e7642e1e88167c1dfc827fdf` ON `shipping_line` (`shippingMethodId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_c9f34a440d490d1b66f6829b86` ON `shipping_line` (`orderId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_6901d8715f5ebadd764466f7bd` ON `order_line` (`sellerChannelId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_dc9ac68b47da7b62249886affb` ON `order_line` (`shippingLineId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_cbcd22193eda94668e84d33f18` ON `order_line` (`productVariantId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_77be94ce9ec650446617946227` ON `order_line` (`taxCategoryId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_9f065453910ea77d4be8e92618` ON `order_line` (`featuredAssetId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_239cfca2a55b98b90b6bef2e44` ON `order_line` (`orderId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_1c6932a756108788a361e7d440` ON `refund` (`paymentId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_d09d285fe1645cd2f0db811e29` ON `payment` (`orderId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_154eb685f9b629033bd266df7f` ON `surcharge` (`orderId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_a49c5271c39cc8174a0535c808` ON `surcharge` (`orderModificationId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_1df5bc14a47ef24d2e681f4559` ON `order_modification` (`orderId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_73a78d7df09541ac5eba620d18` ON `order` (`aggregateOrderId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_124456e637cca7a415897dce65` ON `order` (`customerId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_dc34d382b493ade1f70e834c4d` ON `address` (`customerId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_d87215343c3a3a67e6a0b7f3ea` ON `address` (`countryId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_7a75399a4f4ffa48ee02e98c05` ON `session` (`activeOrderId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_eb87ef1e234444728138302263` ON `session` (`activeChannelId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_3d2f174ef04fb312fdebd0ddc5` ON `session` (`userId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_7ee3306d7638aa85ca90d67219` ON `tax_rate` (`categoryId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_9872fc7de2f4e532fd3230d191` ON `tax_rate` (`zoneId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_8b5ab52fc8887c1a769b9276ca` ON `tax_rate` (`customerGroupId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_92f8c334ef06275f9586fd0183` ON `history_entry` (`administratorId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_43ac602f839847fdb91101f30e` ON `history_entry` (`customerId`)",
      undefined
    );
    await queryRunner.query(
      "CREATE INDEX `IDX_3a05127e67435b4d2332ded7c9` ON `history_entry` (`orderId`)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `region_translation` ADD CONSTRAINT `FK_1afd722b943c81310705fc3e612` FOREIGN KEY (`baseId`) REFERENCES `region`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `region` ADD CONSTRAINT `FK_ed0c8098ce6809925a437f42aec` FOREIGN KEY (`parentId`) REFERENCES `region`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` ADD CONSTRAINT `FK_af2116c7e176b6b88dceceeb74b` FOREIGN KEY (`sellerId`) REFERENCES `seller`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_translation` ADD CONSTRAINT `FK_a79a443c1f7841f3851767faa6d` FOREIGN KEY (`baseId`) REFERENCES `product_option`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_group_translation` ADD CONSTRAINT `FK_93751abc1451972c02e033b766c` FOREIGN KEY (`baseId`) REFERENCES `product_option_group`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_level` ADD CONSTRAINT `FK_9950eae3180f39c71978748bd08` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_level` ADD CONSTRAINT `FK_984c48572468c69661a0b7b0494` FOREIGN KEY (`stockLocationId`) REFERENCES `stock_location`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` ADD CONSTRAINT `FK_a2fe7172eeae9f1cca86f8f573a` FOREIGN KEY (`stockLocationId`) REFERENCES `stock_location`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_price` ADD CONSTRAINT `FK_e6126cd268aea6e9b31d89af9ab` FOREIGN KEY (`variantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_translation` ADD CONSTRAINT `FK_420f4d6fb75d38b9dca79bc43b4` FOREIGN KEY (`baseId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_translation` ADD CONSTRAINT `FK_85ec26c71067ebc84adcd98d1a5` FOREIGN KEY (`baseId`) REFERENCES `shipping_method`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_line` ADD CONSTRAINT `FK_c9f34a440d490d1b66f6829b86c` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD CONSTRAINT `FK_6901d8715f5ebadd764466f7bde` FOREIGN KEY (`sellerChannelId`) REFERENCES `channel`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD CONSTRAINT `FK_dc9ac68b47da7b62249886affba` FOREIGN KEY (`shippingLineId`) REFERENCES `shipping_line`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD CONSTRAINT `FK_cbcd22193eda94668e84d33f185` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line_reference` ADD CONSTRAINT `FK_7d57857922dfc7303604697dbe9` FOREIGN KEY (`orderLineId`) REFERENCES `order_line`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line_reference` ADD CONSTRAINT `FK_06b02fb482b188823e419d37bd4` FOREIGN KEY (`fulfillmentId`) REFERENCES `fulfillment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line_reference` ADD CONSTRAINT `FK_22b818af8722746fb9f206068c2` FOREIGN KEY (`modificationId`) REFERENCES `order_modification`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line_reference` ADD CONSTRAINT `FK_30019aa65b17fe9ee9628931991` FOREIGN KEY (`refundId`) REFERENCES `refund`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion_translation` ADD CONSTRAINT `FK_1cc009e9ab2263a35544064561b` FOREIGN KEY (`baseId`) REFERENCES `promotion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` ADD CONSTRAINT `FK_73a78d7df09541ac5eba620d181` FOREIGN KEY (`aggregateOrderId`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );

    // ======================== Step 3 ========================
    // This line needs to be commented out, and moved to after step 4, otherwise
    // the migration fails with a foreign key constraint error.
    //     await queryRunner.query(
    //       "ALTER TABLE `address` ADD CONSTRAINT `FK_d87215343c3a3a67e6a0b7f3ea9` FOREIGN KEY (`countryId`) REFERENCES `region`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
    //       undefined
    //     );

    await queryRunner.query(
      "ALTER TABLE `payment_method_translation` ADD CONSTRAINT `FK_66187f782a3e71b9e0f5b50b68b` FOREIGN KEY (`baseId`) REFERENCES `payment_method`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `zone_members_region` ADD CONSTRAINT `FK_433f45158e4e2b2a2f344714b22` FOREIGN KEY (`zoneId`) REFERENCES `zone`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `zone_members_region` ADD CONSTRAINT `FK_b45b65256486a15a104e17d495c` FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_location_channels_channel` ADD CONSTRAINT `FK_39513fd02a573c848d23bee587d` FOREIGN KEY (`stockLocationId`) REFERENCES `stock_location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_location_channels_channel` ADD CONSTRAINT `FK_ff8150fe54e56a900d5712671a0` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_fulfillments_fulfillment` ADD CONSTRAINT `FK_f80d84d525af2ffe974e7e8ca29` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_fulfillments_fulfillment` ADD CONSTRAINT `FK_4add5a5796e1582dec2877b2898` FOREIGN KEY (`fulfillmentId`) REFERENCES `fulfillment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_closure` ADD CONSTRAINT `FK_c309f8cd152bbeaea08491e0c66` FOREIGN KEY (`id_ancestor`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_closure` ADD CONSTRAINT `FK_457784c710f8ac9396010441f6c` FOREIGN KEY (`id_descendant`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    // ======================== Step 4 ========================
    // Run the data migrations function
    await vendureV2Migrations(queryRunner);

    // ======================== Step 5 ========================
    // Add the line that we commented out in step 3
    await queryRunner.query(
      "ALTER TABLE `address` ADD CONSTRAINT `FK_d87215343c3a3a67e6a0b7f3ea9` FOREIGN KEY (`countryId`) REFERENCES `region`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );

    // ======================== Step 6 (optional) ========================
    // If you have any custom fields defined on the Country entity, you'll need to transfer the data over to the
    // new Region entity.
    // We do not -> skip.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `collection_closure` DROP FOREIGN KEY `FK_457784c710f8ac9396010441f6c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_closure` DROP FOREIGN KEY `FK_c309f8cd152bbeaea08491e0c66`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_fulfillments_fulfillment` DROP FOREIGN KEY `FK_4add5a5796e1582dec2877b2898`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_fulfillments_fulfillment` DROP FOREIGN KEY `FK_f80d84d525af2ffe974e7e8ca29`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_location_channels_channel` DROP FOREIGN KEY `FK_ff8150fe54e56a900d5712671a0`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_location_channels_channel` DROP FOREIGN KEY `FK_39513fd02a573c848d23bee587d`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `zone_members_region` DROP FOREIGN KEY `FK_b45b65256486a15a104e17d495c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `zone_members_region` DROP FOREIGN KEY `FK_433f45158e4e2b2a2f344714b22`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method_translation` DROP FOREIGN KEY `FK_66187f782a3e71b9e0f5b50b68b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `address` DROP FOREIGN KEY `FK_d87215343c3a3a67e6a0b7f3ea9`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` DROP FOREIGN KEY `FK_73a78d7df09541ac5eba620d181`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion_translation` DROP FOREIGN KEY `FK_1cc009e9ab2263a35544064561b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line_reference` DROP FOREIGN KEY `FK_30019aa65b17fe9ee9628931991`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line_reference` DROP FOREIGN KEY `FK_22b818af8722746fb9f206068c2`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line_reference` DROP FOREIGN KEY `FK_06b02fb482b188823e419d37bd4`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line_reference` DROP FOREIGN KEY `FK_7d57857922dfc7303604697dbe9`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP FOREIGN KEY `FK_cbcd22193eda94668e84d33f185`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP FOREIGN KEY `FK_dc9ac68b47da7b62249886affba`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP FOREIGN KEY `FK_6901d8715f5ebadd764466f7bde`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_line` DROP FOREIGN KEY `FK_c9f34a440d490d1b66f6829b86c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_translation` DROP FOREIGN KEY `FK_85ec26c71067ebc84adcd98d1a5`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_translation` DROP FOREIGN KEY `FK_420f4d6fb75d38b9dca79bc43b4`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_price` DROP FOREIGN KEY `FK_e6126cd268aea6e9b31d89af9ab`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` DROP FOREIGN KEY `FK_a2fe7172eeae9f1cca86f8f573a`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_level` DROP FOREIGN KEY `FK_984c48572468c69661a0b7b0494`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_level` DROP FOREIGN KEY `FK_9950eae3180f39c71978748bd08`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_group_translation` DROP FOREIGN KEY `FK_93751abc1451972c02e033b766c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_translation` DROP FOREIGN KEY `FK_a79a443c1f7841f3851767faa6d`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` DROP FOREIGN KEY `FK_af2116c7e176b6b88dceceeb74b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `region` DROP FOREIGN KEY `FK_ed0c8098ce6809925a437f42aec`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `region_translation` DROP FOREIGN KEY `FK_1afd722b943c81310705fc3e612`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_3a05127e67435b4d2332ded7c9` ON `history_entry`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_43ac602f839847fdb91101f30e` ON `history_entry`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_92f8c334ef06275f9586fd0183` ON `history_entry`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_8b5ab52fc8887c1a769b9276ca` ON `tax_rate`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_9872fc7de2f4e532fd3230d191` ON `tax_rate`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_7ee3306d7638aa85ca90d67219` ON `tax_rate`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_3d2f174ef04fb312fdebd0ddc5` ON `session`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_eb87ef1e234444728138302263` ON `session`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_7a75399a4f4ffa48ee02e98c05` ON `session`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_d87215343c3a3a67e6a0b7f3ea` ON `address`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_dc34d382b493ade1f70e834c4d` ON `address`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_124456e637cca7a415897dce65` ON `order`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_73a78d7df09541ac5eba620d18` ON `order`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_1df5bc14a47ef24d2e681f4559` ON `order_modification`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_a49c5271c39cc8174a0535c808` ON `surcharge`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_154eb685f9b629033bd266df7f` ON `surcharge`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_d09d285fe1645cd2f0db811e29` ON `payment`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_1c6932a756108788a361e7d440` ON `refund`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_239cfca2a55b98b90b6bef2e44` ON `order_line`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_9f065453910ea77d4be8e92618` ON `order_line`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_77be94ce9ec650446617946227` ON `order_line`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_cbcd22193eda94668e84d33f18` ON `order_line`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_dc9ac68b47da7b62249886affb` ON `order_line`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_6901d8715f5ebadd764466f7bd` ON `order_line`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_c9f34a440d490d1b66f6829b86` ON `shipping_line`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_e2e7642e1e88167c1dfc827fdf` ON `shipping_line`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_85ec26c71067ebc84adcd98d1a` ON `shipping_method_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_6e420052844edf3a5506d863ce` ON `product_variant`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_e38dca0d82fd64c7cf8aac8b8e` ON `product_variant`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_0e6f516053cf982b537836e21c` ON `product_variant`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_420f4d6fb75d38b9dca79bc43b` ON `product_variant_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_e6126cd268aea6e9b31d89af9a` ON `product_variant_price`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_fa21412afac15a2304f3eb35fe` ON `product_variant_asset`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_10b5a2e3dee0e30b1e26c32f5c` ON `product_variant_asset`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_d2c8d5fca981cc820131f81aa8` ON `stock_movement`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_a2fe7172eeae9f1cca86f8f573` ON `stock_movement`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_e65ba3882557cab4febb54809b` ON `stock_movement`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_91a19e6613534949a4ce6e76ff` ON `product`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_7dbc75cb4e8b002620c4dbfdac` ON `product_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_f4a2ec16ba86d277b6faa0b67b` ON `product_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_0d1294f5c22a56da7845ebab72` ON `product_asset`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_5888ac17b317b93378494a1062` ON `product_asset`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_a6e91739227bf4d442f23c52c7` ON `product_option_group`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_93751abc1451972c02e033b766` ON `product_option_group_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_a6debf9198e2fbfa006aa10d71` ON `product_option`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_a79a443c1f7841f3851767faa6` ON `product_option_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_d101dc2265a7341be3d94968c5` ON `facet_value`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_3d6e45823b65de808a66cb1423` ON `facet_value_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_eaea53f44bf9e97790d38a3d68` ON `facet_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_7256fef1bb42f1b38156b7449f` ON `collection`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_e329f9036210d75caa1d8f2154` ON `collection_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_9f9da7d94b0278ea0f7831e1fc` ON `collection_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_1ed9e48dfbf74b5fcbb35d3d68` ON `collection_asset`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_51da53b26522dc0525762d2de8` ON `collection_asset`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_c9ca2f58d4517460435cbd8b4c` ON `channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_afe9f917a1c82b9e9e69f7c612` ON `channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_af2116c7e176b6b88dceceeb74` ON `channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_00cbe87bc0d4e36758d61bd31d` ON `authentication_method`",
      undefined
    );
    // See comment above
    //     await queryRunner.query(
    //       "ALTER TABLE `job_record` DROP COLUMN `data`",
    //       undefined
    //     );
    //     await queryRunner.query(
    //       'ALTER TABLE `job_record` ADD `data` longtext COLLATE "utf8mb4_general_ci" NULL',
    //       undefined
    //     );
    await queryRunner.query(
      "ALTER TABLE `order` DROP INDEX `IDX_729b3eea7ce540930dbb706949`",
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `order` CHANGE `code` `code` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NOT NULL',
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` CHANGE `productVariantId` `productVariantId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD CONSTRAINT `FK_cbcd22193eda94668e84d33f185` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_price` CHANGE `channelId` `channelId` int NOT NULL",
      undefined
    );
    // See comment above
    //     await queryRunner.query(
    //       "ALTER TABLE `product` DROP COLUMN `customFieldsCustomizationoptions`",
    //       undefined
    //     );
    //     await queryRunner.query(
    //       'ALTER TABLE `product` ADD `customFieldsCustomizationoptions` text CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NULL',
    //       undefined
    //     );
    await queryRunner.query(
      "ALTER TABLE `order` DROP COLUMN `aggregateOrderId`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` DROP COLUMN `type`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP COLUMN `listPrice`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP COLUMN `initialListPrice`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP COLUMN `shippingLineId`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP COLUMN `sellerChannelId`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP COLUMN `taxLines`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP COLUMN `adjustments`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP COLUMN `listPriceIncludesTax`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP COLUMN `orderPlacedQuantity`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP COLUMN `quantity`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_price` DROP COLUMN `currencyCode`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection` DROP COLUMN `inheritFilters`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` DROP COLUMN `sellerId`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` DROP COLUMN `outOfStockThreshold`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` DROP COLUMN `trackInventory`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` DROP COLUMN `availableCurrencyCodes`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` DROP COLUMN `defaultCurrencyCode`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` DROP COLUMN `availableLanguageCodes`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `channel` DROP COLUMN `description`",
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `payment_method` ADD `name` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NOT NULL DEFAULT \'\'',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `payment_method` ADD `description` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NOT NULL DEFAULT \'\'',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `promotion` ADD `name` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NOT NULL',
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD `stockOnHand` int NOT NULL DEFAULT '0'",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD `stockAllocated` int NOT NULL DEFAULT '0'",
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `channel` ADD `currencyCode` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NOT NULL',
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_457784c710f8ac9396010441f6` ON `collection_closure`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_c309f8cd152bbeaea08491e0c6` ON `collection_closure`",
      undefined
    );
    await queryRunner.query("DROP TABLE `collection_closure`", undefined);
    await queryRunner.query(
      "DROP INDEX `IDX_4add5a5796e1582dec2877b289` ON `order_fulfillments_fulfillment`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_f80d84d525af2ffe974e7e8ca2` ON `order_fulfillments_fulfillment`",
      undefined
    );
    await queryRunner.query(
      "DROP TABLE `order_fulfillments_fulfillment`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_ff8150fe54e56a900d5712671a` ON `stock_location_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_39513fd02a573c848d23bee587` ON `stock_location_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP TABLE `stock_location_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_b45b65256486a15a104e17d495` ON `zone_members_region`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_433f45158e4e2b2a2f344714b2` ON `zone_members_region`",
      undefined
    );
    await queryRunner.query("DROP TABLE `zone_members_region`", undefined);
    await queryRunner.query(
      "DROP INDEX `IDX_66187f782a3e71b9e0f5b50b68` ON `payment_method_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP TABLE `payment_method_translation`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_1cc009e9ab2263a35544064561` ON `promotion_translation`",
      undefined
    );
    await queryRunner.query("DROP TABLE `promotion_translation`", undefined);
    await queryRunner.query(
      "DROP INDEX `IDX_49a8632be8cef48b076446b8b9` ON `order_line_reference`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_30019aa65b17fe9ee962893199` ON `order_line_reference`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_22b818af8722746fb9f206068c` ON `order_line_reference`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_06b02fb482b188823e419d37bd` ON `order_line_reference`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_7d57857922dfc7303604697dbe` ON `order_line_reference`",
      undefined
    );
    await queryRunner.query("DROP TABLE `order_line_reference`", undefined);
    await queryRunner.query(
      "DROP INDEX `IDX_7fc20486b8cfd33dc84c96e168` ON `stock_level`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_984c48572468c69661a0b7b049` ON `stock_level`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_9950eae3180f39c71978748bd0` ON `stock_level`",
      undefined
    );
    await queryRunner.query("DROP TABLE `stock_level`", undefined);
    await queryRunner.query("DROP TABLE `stock_location`", undefined);
    await queryRunner.query(
      "DROP INDEX `IDX_ed0c8098ce6809925a437f42ae` ON `region`",
      undefined
    );
    await queryRunner.query("DROP TABLE `region`", undefined);
    await queryRunner.query(
      "DROP INDEX `IDX_1afd722b943c81310705fc3e61` ON `region_translation`",
      undefined
    );
    await queryRunner.query("DROP TABLE `region_translation`", undefined);
    await queryRunner.query("DROP TABLE `seller`", undefined);
    await queryRunner.query(
      "ALTER TABLE `stock_movement` CHANGE `stockLocationId` `orderItemId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `address` ADD CONSTRAINT `FK_d87215343c3a3a67e6a0b7f3ea9` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_line` ADD CONSTRAINT `FK_c9f34a440d490d1b66f6829b86c` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_translation` ADD CONSTRAINT `FK_85ec26c71067ebc84adcd98d1a5` FOREIGN KEY (`baseId`) REFERENCES `shipping_method`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_translation` ADD CONSTRAINT `FK_420f4d6fb75d38b9dca79bc43b4` FOREIGN KEY (`baseId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_price` ADD CONSTRAINT `FK_e6126cd268aea6e9b31d89af9ab` FOREIGN KEY (`variantId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` ADD CONSTRAINT `FK_cbb0990e398bf7713aebdd38482` FOREIGN KEY (`orderItemId`) REFERENCES `order_item`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_group_translation` ADD CONSTRAINT `FK_93751abc1451972c02e033b766c` FOREIGN KEY (`baseId`) REFERENCES `product_option_group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_option_translation` ADD CONSTRAINT `FK_a79a443c1f7841f3851767faa6d` FOREIGN KEY (`baseId`) REFERENCES `product_option`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
  }
}
