import { MigrationInterface, QueryRunner } from "typeorm";

export class UpgradeToVendureV2331765192804692 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP FOREIGN KEY `FK_9f065453910ea77d4be8e92618f`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP FOREIGN KEY `FK_cbcd22193eda94668e84d33f185`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_channels_channel` DROP FOREIGN KEY `FK_7216ab24077cf5cbece7857dbbd`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_channels_channel` DROP FOREIGN KEY `FK_2a8ea404d05bf682516184db7d3`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` DROP FOREIGN KEY `FK_e1d54c0b9db3e2eb17faaf5919c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_facet_values_facet_value` DROP FOREIGN KEY `FK_06e7d73673ee630e8ec50d0b29f`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` DROP FOREIGN KEY `FK_a51dfbd87c330c075c39832b6e7`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` DROP FOREIGN KEY `FK_0eaaf0f4b6c69afde1e88ffb52d`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_channels_channel` DROP FOREIGN KEY `FK_f2b98dfb56685147bed509acc3d`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_promotions_promotion` DROP FOREIGN KEY `FK_2c26b988769c0e3b0120bdef31b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_fulfillments_fulfillment` DROP FOREIGN KEY `FK_4add5a5796e1582dec2877b2898`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_location_channels_channel` DROP FOREIGN KEY `FK_ff8150fe54e56a900d5712671a0`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_options_product_option` DROP FOREIGN KEY `FK_e96a71affe63c97f7fa2f076dac`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_facet_values_facet_value` DROP FOREIGN KEY `FK_0d641b761ed1dce4ef3cd33d559`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` DROP FOREIGN KEY `FK_d194bff171b62357688a5d0f559`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` DROP FOREIGN KEY `FK_dc9f69207a8867f83b0fd257e30`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` DROP FOREIGN KEY `FK_c00e36f667d35031087b382e61b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` DROP FOREIGN KEY `FK_e09dfee62b158307404202b43a5`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion` ADD `usageLimit` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value` DROP FOREIGN KEY `FK_d101dc2265a7341be3d94968c5b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value` CHANGE `facetId` `facetId` int NOT NULL",
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
      "ALTER TABLE `facet_value` ADD CONSTRAINT `FK_d101dc2265a7341be3d94968c5b` FOREIGN KEY (`facetId`) REFERENCES `facet`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD CONSTRAINT `FK_cbcd22193eda94668e84d33f185` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD CONSTRAINT `FK_9f065453910ea77d4be8e92618f` FOREIGN KEY (`featuredAssetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_channels_channel` ADD CONSTRAINT `FK_7216ab24077cf5cbece7857dbbd` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_channels_channel` ADD CONSTRAINT `FK_2a8ea404d05bf682516184db7d3` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` ADD CONSTRAINT `FK_e1d54c0b9db3e2eb17faaf5919c` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_facet_values_facet_value` ADD CONSTRAINT `FK_06e7d73673ee630e8ec50d0b29f` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` ADD CONSTRAINT `FK_a51dfbd87c330c075c39832b6e7` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` ADD CONSTRAINT `FK_0eaaf0f4b6c69afde1e88ffb52d` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_channels_channel` ADD CONSTRAINT `FK_f2b98dfb56685147bed509acc3d` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_promotions_promotion` ADD CONSTRAINT `FK_2c26b988769c0e3b0120bdef31b` FOREIGN KEY (`promotionId`) REFERENCES `promotion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_fulfillments_fulfillment` ADD CONSTRAINT `FK_4add5a5796e1582dec2877b2898` FOREIGN KEY (`fulfillmentId`) REFERENCES `fulfillment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_location_channels_channel` ADD CONSTRAINT `FK_ff8150fe54e56a900d5712671a0` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_options_product_option` ADD CONSTRAINT `FK_e96a71affe63c97f7fa2f076dac` FOREIGN KEY (`productOptionId`) REFERENCES `product_option`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_facet_values_facet_value` ADD CONSTRAINT `FK_0d641b761ed1dce4ef3cd33d559` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` ADD CONSTRAINT `FK_d194bff171b62357688a5d0f559` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` ADD CONSTRAINT `FK_dc9f69207a8867f83b0fd257e30` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` ADD CONSTRAINT `FK_c00e36f667d35031087b382e61b` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` ADD CONSTRAINT `FK_e09dfee62b158307404202b43a5` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` DROP FOREIGN KEY `FK_e09dfee62b158307404202b43a5`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` DROP FOREIGN KEY `FK_c00e36f667d35031087b382e61b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` DROP FOREIGN KEY `FK_dc9f69207a8867f83b0fd257e30`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` DROP FOREIGN KEY `FK_d194bff171b62357688a5d0f559`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_facet_values_facet_value` DROP FOREIGN KEY `FK_0d641b761ed1dce4ef3cd33d559`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_options_product_option` DROP FOREIGN KEY `FK_e96a71affe63c97f7fa2f076dac`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_location_channels_channel` DROP FOREIGN KEY `FK_ff8150fe54e56a900d5712671a0`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_fulfillments_fulfillment` DROP FOREIGN KEY `FK_4add5a5796e1582dec2877b2898`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_promotions_promotion` DROP FOREIGN KEY `FK_2c26b988769c0e3b0120bdef31b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_channels_channel` DROP FOREIGN KEY `FK_f2b98dfb56685147bed509acc3d`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` DROP FOREIGN KEY `FK_0eaaf0f4b6c69afde1e88ffb52d`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` DROP FOREIGN KEY `FK_a51dfbd87c330c075c39832b6e7`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_facet_values_facet_value` DROP FOREIGN KEY `FK_06e7d73673ee630e8ec50d0b29f`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` DROP FOREIGN KEY `FK_e1d54c0b9db3e2eb17faaf5919c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_channels_channel` DROP FOREIGN KEY `FK_2a8ea404d05bf682516184db7d3`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_channels_channel` DROP FOREIGN KEY `FK_7216ab24077cf5cbece7857dbbd`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP FOREIGN KEY `FK_9f065453910ea77d4be8e92618f`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` DROP FOREIGN KEY `FK_cbcd22193eda94668e84d33f185`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value` DROP FOREIGN KEY `FK_d101dc2265a7341be3d94968c5b`",
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
      "ALTER TABLE `facet_value` CHANGE `facetId` `facetId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value` ADD CONSTRAINT `FK_d101dc2265a7341be3d94968c5b` FOREIGN KEY (`facetId`) REFERENCES `facet`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion` DROP COLUMN `usageLimit`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` ADD CONSTRAINT `FK_e09dfee62b158307404202b43a5` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` ADD CONSTRAINT `FK_c00e36f667d35031087b382e61b` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` ADD CONSTRAINT `FK_dc9f69207a8867f83b0fd257e30` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` ADD CONSTRAINT `FK_d194bff171b62357688a5d0f559` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_facet_values_facet_value` ADD CONSTRAINT `FK_0d641b761ed1dce4ef3cd33d559` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_options_product_option` ADD CONSTRAINT `FK_e96a71affe63c97f7fa2f076dac` FOREIGN KEY (`productOptionId`) REFERENCES `product_option`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `stock_location_channels_channel` ADD CONSTRAINT `FK_ff8150fe54e56a900d5712671a0` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_fulfillments_fulfillment` ADD CONSTRAINT `FK_4add5a5796e1582dec2877b2898` FOREIGN KEY (`fulfillmentId`) REFERENCES `fulfillment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_promotions_promotion` ADD CONSTRAINT `FK_2c26b988769c0e3b0120bdef31b` FOREIGN KEY (`promotionId`) REFERENCES `promotion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_channels_channel` ADD CONSTRAINT `FK_f2b98dfb56685147bed509acc3d` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` ADD CONSTRAINT `FK_0eaaf0f4b6c69afde1e88ffb52d` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` ADD CONSTRAINT `FK_a51dfbd87c330c075c39832b6e7` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_facet_values_facet_value` ADD CONSTRAINT `FK_06e7d73673ee630e8ec50d0b29f` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` ADD CONSTRAINT `FK_e1d54c0b9db3e2eb17faaf5919c` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_channels_channel` ADD CONSTRAINT `FK_2a8ea404d05bf682516184db7d3` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_channels_channel` ADD CONSTRAINT `FK_7216ab24077cf5cbece7857dbbd` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD CONSTRAINT `FK_cbcd22193eda94668e84d33f185` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_line` ADD CONSTRAINT `FK_9f065453910ea77d4be8e92618f` FOREIGN KEY (`featuredAssetId`) REFERENCES `asset`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
  }
}
