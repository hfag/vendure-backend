import { MigrationInterface, QueryRunner } from "typeorm";

export class v0171608121093166 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE `order_item` SET `unitPrice` = ROUND(`unitPrice` / ((`taxRate` + 100) / 100)) WHERE `unitPriceIncludesTax` = 1",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `history_entry` DROP FOREIGN KEY `FK_3a05127e67435b4d2332ded7c9e`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `history_entry` DROP FOREIGN KEY `FK_43ac602f839847fdb91101f30ec`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `stock_movement` DROP FOREIGN KEY `FK_cbb0990e398bf7713aebdd38482`;",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `REL_cbb0990e398bf7713aebdd3848` ON `stock_movement`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` ADD CONSTRAINT `FK_cbb0990e398bf7713aebdd38482` FOREIGN KEY (`orderItemId`) REFERENCES `order_item` (`id`);",
      undefined
    );

    await queryRunner.query(
      "CREATE TABLE `shipping_method_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL DEFAULT '', `description` varchar(255) NOT NULL DEFAULT '', `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined
    );

    await queryRunner.query(
      "INSERT INTO `shipping_method_translation` (`languageCode`, `name`, `description`, `baseId`) SELECT 'en', `description`, '', id FROM `shipping_method`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `order_item` DROP COLUMN `unitPriceIncludesTax`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method` DROP COLUMN `description`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` ADD `orderLineId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD `stockAllocated` int NOT NULL DEFAULT 0",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD `outOfStockThreshold` int NOT NULL DEFAULT 0",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD `useGlobalOutOfStockThreshold` tinyint NOT NULL DEFAULT 1",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `global_settings` ADD `outOfStockThreshold` int NOT NULL DEFAULT 0",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` DROP COLUMN `trackInventory`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD `trackInventory` varchar(255) NOT NULL DEFAULT 'INHERIT'",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `fulfillment` CHANGE `state` `state` varchar(255) NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `global_settings` CHANGE `trackInventory` `trackInventory` tinyint NOT NULL DEFAULT 1",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` ADD CONSTRAINT `FK_d2c8d5fca981cc820131f81aa83` FOREIGN KEY (`orderLineId`) REFERENCES `order_line`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_translation` ADD CONSTRAINT `FK_85ec26c71067ebc84adcd98d1a5` FOREIGN KEY (`baseId`) REFERENCES `shipping_method`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `history_entry` ADD CONSTRAINT `FK_43ac602f839847fdb91101f30ec` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `history_entry` ADD CONSTRAINT `FK_3a05127e67435b4d2332ded7c9e` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query("SET FOREIGN_KEY_CHECKS=1;", undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `history_entry` DROP FOREIGN KEY `FK_3a05127e67435b4d2332ded7c9e`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `history_entry` DROP FOREIGN KEY `FK_43ac602f839847fdb91101f30ec`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_translation` DROP FOREIGN KEY `FK_85ec26c71067ebc84adcd98d1a5`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` DROP FOREIGN KEY `FK_d2c8d5fca981cc820131f81aa83`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `global_settings` CHANGE `trackInventory` `trackInventory` tinyint NOT NULL DEFAULT '0'",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `fulfillment` CHANGE `state` `state` varchar(255) NOT NULL DEFAULT 'Delivered'",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` DROP COLUMN `trackInventory`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD `trackInventory` tinyint NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `global_settings` DROP COLUMN `outOfStockThreshold`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` DROP COLUMN `useGlobalOutOfStockThreshold`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` DROP COLUMN `outOfStockThreshold`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` DROP COLUMN `stockAllocated`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` DROP COLUMN `orderLineId`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method` ADD `description` varchar(255) NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item` ADD `unitPriceIncludesTax` tinyint NOT NULL",
      undefined
    );
    await queryRunner.query(
      "DROP TABLE `shipping_method_translation`",
      undefined
    );
    await queryRunner.query(
      "CREATE UNIQUE INDEX `REL_cbb0990e398bf7713aebdd3848` ON `stock_movement` (`orderItemId`)",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `history_entry` ADD CONSTRAINT `FK_43ac602f839847fdb91101f30ec` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `history_entry` ADD CONSTRAINT `FK_3a05127e67435b4d2332ded7c9e` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
  }
}
