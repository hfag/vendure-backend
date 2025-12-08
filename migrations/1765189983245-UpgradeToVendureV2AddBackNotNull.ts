import { MigrationInterface, QueryRunner } from "typeorm";

export class UpgradeToVendureV2AddBackNotNull1765189983245
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `channel` CHANGE `defaultCurrencyCode` `defaultCurrencyCode` varchar(255) NOT NULL",
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
      "ALTER TABLE `stock_movement` DROP FOREIGN KEY `FK_a2fe7172eeae9f1cca86f8f573a`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` CHANGE `stockLocationId` `stockLocationId` int NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_price` CHANGE `currencyCode` `currencyCode` varchar(255) NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` CHANGE `quantity` `quantity` int NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` CHANGE `listPriceIncludesTax` `listPriceIncludesTax` tinyint NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` CHANGE `adjustments` `adjustments` text NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` CHANGE `taxLines` `taxLines` text NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` CHANGE `listPrice` `listPrice` int NOT NULL",
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
      "ALTER TABLE `stock_movement` ADD CONSTRAINT `FK_a2fe7172eeae9f1cca86f8f573a` FOREIGN KEY (`stockLocationId`) REFERENCES `stock_location`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `stock_movement` DROP FOREIGN KEY `FK_a2fe7172eeae9f1cca86f8f573a`",
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
      "ALTER TABLE `order_line` CHANGE `listPrice` `listPrice` int NULL",
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` CHANGE `taxLines` `taxLines` text CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NULL',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` CHANGE `adjustments` `adjustments` text CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NULL',
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` CHANGE `listPriceIncludesTax` `listPriceIncludesTax` tinyint NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` CHANGE `quantity` `quantity` int NULL",
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_price` CHANGE `currencyCode` `currencyCode` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NULL',
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` CHANGE `stockLocationId` `stockLocationId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_movement` ADD CONSTRAINT `FK_a2fe7172eeae9f1cca86f8f573a` FOREIGN KEY (`stockLocationId`) REFERENCES `stock_location`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
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
      'ALTER TABLE `channel` CHANGE `defaultCurrencyCode` `defaultCurrencyCode` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NULL',
      undefined
    );
  }
}
