import { MigrationInterface, QueryRunner } from "typeorm";

import {
  addProductVariantsToProductChannels,
  migrateDefaultShippingCalculatorArgs,
  migrateOrderAdjustmentsToSurcharges,
  migrateOrderItemPromotionsAndTaxes,
  migrateOrderShippingToShippingLines,
} from "../migration-utils-v018";

export class v0181610204170263 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `order_item` DROP FOREIGN KEY `FK_eed51be48640c21e1c76d3e9fbe`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` DROP FOREIGN KEY `FK_4af424d3e7b2c3cb26e075e20fc`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_42187bb72520a713d625389489` ON `product_translation`",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `surcharge` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `description` varchar(255) NOT NULL, `listPrice` int NOT NULL, `listPriceIncludesTax` tinyint NOT NULL, `sku` varchar(255) NOT NULL, `taxLines` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `orderId` int NULL, `orderModificationId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `order_modification` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `note` varchar(255) NOT NULL, `priceChange` int NOT NULL, `shippingAddressChange` text NULL, `billingAddressChange` text NULL, `id` int NOT NULL AUTO_INCREMENT, `orderId` int NULL, `paymentId` int NULL, `refundId` int NULL, UNIQUE INDEX `REL_ad2991fa2933ed8b7f86a71633` (`paymentId`), UNIQUE INDEX `REL_cb66b63b6e97613013795eadbd` (`refundId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `shipping_line` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `listPrice` int NOT NULL, `listPriceIncludesTax` tinyint NOT NULL, `adjustments` text NOT NULL, `taxLines` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `shippingMethodId` int NOT NULL, `orderId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `product_variant_channels_channel` (`productVariantId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_beeb2b3cd800e589f2213ae99d` (`productVariantId`), INDEX `IDX_d194bff171b62357688a5d0f55` (`channelId`), PRIMARY KEY (`productVariantId`, `channelId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `order_item_fulfillments_fulfillment` (`orderItemId` int NOT NULL, `fulfillmentId` int NOT NULL, INDEX `IDX_a568a3d5aa7f237edab624960b` (`orderItemId`), INDEX `IDX_8132041a647c28eb27ecc1691f` (`fulfillmentId`), PRIMARY KEY (`orderItemId`, `fulfillmentId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "CREATE TABLE `order_modification_order_items_order_item` (`orderModificationId` int NOT NULL, `orderItemId` int NOT NULL, INDEX `IDX_a48502a38aded69d087a8ec08a` (`orderModificationId`), INDEX `IDX_9d631d7bd3d44af50eca535d72` (`orderItemId`), PRIMARY KEY (`orderModificationId`, `orderItemId`)) ENGINE=InnoDB",
      undefined
    );

    // Multiple Fulfillments per OrderItem
    await queryRunner.query(
      "ALTER TABLE `order_item_fulfillments_fulfillment` ADD CONSTRAINT `FK_a568a3d5aa7f237edab624960b9` FOREIGN KEY (`orderItemId`) REFERENCES `order_item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item_fulfillments_fulfillment` ADD CONSTRAINT `FK_8132041a647c28eb27ecc1691fa` FOREIGN KEY (`fulfillmentId`) REFERENCES `fulfillment`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    /* add this line */
    await queryRunner.query(
      "INSERT INTO `order_item_fulfillments_fulfillment` (`orderItemId`, `fulfillmentId`) SELECT `id`, `fulfillmentId` FROM `order_item` WHERE `fulfillmentId` IS NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` DROP COLUMN `fulfillmentId`",
      undefined
    );

    // Implement FulfillmentHandlers
    /* add DEFAULT value */
    await queryRunner.query(
      "ALTER TABLE `fulfillment` ADD `handlerCode` varchar(255) NOT NULL DEFAULT 'manual-fulfillment'",
      undefined
    );
    /* add DEFAULT value */
    await queryRunner.query(
      "ALTER TABLE `shipping_method` ADD `fulfillmentHandlerCode` varchar(255) NOT NULL DEFAULT 'manual-fulfillment'",
      undefined
    );

    // Split taxes from adjustments: rename OrderItem `pendingAdjustments` to `adjustments`
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `adjustments` text NOT NULL",
      undefined
    );
    /* add this line */
    await queryRunner.query(
      "UPDATE `order_item` SET `adjustments` = `pendingAdjustments`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `taxLines` text NOT NULL",
      undefined
    );
    /* add this line */
    await migrateOrderItemPromotionsAndTaxes(queryRunner);
    await queryRunner.query(
      "ALTER TABLE `order_item` DROP COLUMN `pendingAdjustments`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` DROP COLUMN `taxRate`",
      undefined
    );

    // Rename OrderItem unitPrice to listPrice
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `listPrice` int NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `listPriceIncludesTax` tinyint NOT NULL",
      undefined
    );
    /* add this line */
    await queryRunner.query(
      "UPDATE `order_item` SET `listPrice` = `unitPrice`",
      undefined
    );
    /* add this line */
    await queryRunner.query(
      "UPDATE `order_item` SET `listPriceIncludesTax` = false",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` DROP COLUMN `unitPrice`",
      undefined
    );

    // Rename Order.subTotal -> subTotalWithTax, subTotalBeforeTax -> subTotal
    await queryRunner.query(
      "ALTER TABLE `order` ADD `subTotalWithTax` int NOT NULL",
      undefined
    );
    /* add this line */
    await queryRunner.query(
      "UPDATE `order` SET `subTotalWithTax` = `subTotal`",
      undefined
    );
    /* add this line */
    await queryRunner.query(
      "UPDATE `order` SET `subTotal` = `subTotalBeforeTax`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` DROP COLUMN `subTotalBeforeTax`",
      undefined
    );

    // Convert order-level adjustments to Surcharges
    /* add this line */
    await migrateOrderAdjustmentsToSurcharges(queryRunner);
    await queryRunner.query(
      "ALTER TABLE `order` DROP COLUMN `pendingAdjustments`",
      undefined
    );

    // Update default ShippingCalculator arguments
    /* add this line */
    await migrateDefaultShippingCalculatorArgs(queryRunner);

    // Multiple shipping lines
    await queryRunner.query(
      "ALTER TABLE `shipping_line` ADD CONSTRAINT `FK_e2e7642e1e88167c1dfc827fdf3` FOREIGN KEY (`shippingMethodId`) REFERENCES `shipping_method`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_line` ADD CONSTRAINT `FK_c9f34a440d490d1b66f6829b86c` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await migrateOrderShippingToShippingLines(queryRunner);
    await queryRunner.query(
      "ALTER TABLE `order` DROP COLUMN `shippingMethodId`",
      undefined
    );

    // ChannelAware ProductVariants
    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` ADD CONSTRAINT `FK_beeb2b3cd800e589f2213ae99d6` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` ADD CONSTRAINT `FK_d194bff171b62357688a5d0f559` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    /* add this line */
    await addProductVariantsToProductChannels(queryRunner);

    await queryRunner.query(
      "ALTER TABLE `product_variant` DROP COLUMN `lastPriceValue`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `surcharge` ADD CONSTRAINT `FK_154eb685f9b629033bd266df7fa` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `surcharge` ADD CONSTRAINT `FK_a49c5271c39cc8174a0535c8088` FOREIGN KEY (`orderModificationId`) REFERENCES `order_modification`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` ADD CONSTRAINT `FK_1df5bc14a47ef24d2e681f45598` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` ADD CONSTRAINT `FK_ad2991fa2933ed8b7f86a716338` FOREIGN KEY (`paymentId`) REFERENCES `payment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` ADD CONSTRAINT `FK_cb66b63b6e97613013795eadbd5` FOREIGN KEY (`refundId`) REFERENCES `refund`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification_order_items_order_item` ADD CONSTRAINT `FK_a48502a38aded69d087a8ec08ad` FOREIGN KEY (`orderModificationId`) REFERENCES `order_modification`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification_order_items_order_item` ADD CONSTRAINT `FK_9d631d7bd3d44af50eca535d728` FOREIGN KEY (`orderItemId`) REFERENCES `order_item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `order_modification_order_items_order_item` DROP FOREIGN KEY `FK_9d631d7bd3d44af50eca535d728`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification_order_items_order_item` DROP FOREIGN KEY `FK_a48502a38aded69d087a8ec08ad`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item_fulfillments_fulfillment` DROP FOREIGN KEY `FK_8132041a647c28eb27ecc1691fa`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item_fulfillments_fulfillment` DROP FOREIGN KEY `FK_a568a3d5aa7f237edab624960b9`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` DROP FOREIGN KEY `FK_d194bff171b62357688a5d0f559`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` DROP FOREIGN KEY `FK_beeb2b3cd800e589f2213ae99d6`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_line` DROP FOREIGN KEY `FK_c9f34a440d490d1b66f6829b86c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_line` DROP FOREIGN KEY `FK_e2e7642e1e88167c1dfc827fdf3`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` DROP FOREIGN KEY `FK_cb66b63b6e97613013795eadbd5`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` DROP FOREIGN KEY `FK_ad2991fa2933ed8b7f86a716338`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification` DROP FOREIGN KEY `FK_1df5bc14a47ef24d2e681f45598`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `surcharge` DROP FOREIGN KEY `FK_a49c5271c39cc8174a0535c8088`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `surcharge` DROP FOREIGN KEY `FK_154eb685f9b629033bd266df7fa`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` DROP COLUMN `subTotalWithTax`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method` DROP COLUMN `fulfillmentHandlerCode`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` DROP COLUMN `taxLines`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` DROP COLUMN `adjustments`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` DROP COLUMN `listPriceIncludesTax`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` DROP COLUMN `listPrice`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `fulfillment` DROP COLUMN `handlerCode`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` ADD `shippingMethodId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` ADD `subTotalBeforeTax` int NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` ADD `pendingAdjustments` text NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `fulfillmentId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `pendingAdjustments` text NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `taxRate` decimal(5,2) NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `unitPrice` int NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD `lastPriceValue` int NOT NULL COMMENT 'Not used - actual price is stored in product_variant_price table'",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_9d631d7bd3d44af50eca535d72` ON `order_modification_order_items_order_item`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_a48502a38aded69d087a8ec08a` ON `order_modification_order_items_order_item`",
      undefined
    );
    await queryRunner.query(
      "DROP TABLE `order_modification_order_items_order_item`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_8132041a647c28eb27ecc1691f` ON `order_item_fulfillments_fulfillment`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_a568a3d5aa7f237edab624960b` ON `order_item_fulfillments_fulfillment`",
      undefined
    );
    await queryRunner.query(
      "DROP TABLE `order_item_fulfillments_fulfillment`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_d194bff171b62357688a5d0f55` ON `product_variant_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_beeb2b3cd800e589f2213ae99d` ON `product_variant_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP TABLE `product_variant_channels_channel`",
      undefined
    );
    await queryRunner.query("DROP TABLE `shipping_line`", undefined);
    await queryRunner.query(
      "DROP INDEX `REL_cb66b63b6e97613013795eadbd` ON `order_modification`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `REL_ad2991fa2933ed8b7f86a71633` ON `order_modification`",
      undefined
    );
    await queryRunner.query("DROP TABLE `order_modification`", undefined);
    await queryRunner.query("DROP TABLE `surcharge`", undefined);
    await queryRunner.query(
      "CREATE UNIQUE INDEX `IDX_42187bb72520a713d625389489` ON `product_translation` (`languageCode`, `slug`)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order` ADD CONSTRAINT `FK_4af424d3e7b2c3cb26e075e20fc` FOREIGN KEY (`shippingMethodId`, `shippingMethodId`) REFERENCES `shipping_method`(`id`,`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD CONSTRAINT `FK_eed51be48640c21e1c76d3e9fbe` FOREIGN KEY (`fulfillmentId`, `fulfillmentId`) REFERENCES `fulfillment`(`id`,`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
  }
}
