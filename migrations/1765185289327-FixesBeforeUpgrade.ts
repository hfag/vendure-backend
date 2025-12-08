import { MigrationInterface, QueryRunner } from "typeorm";

export class FixesBeforeUpgrade1765185289327 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // Clean corrupt data
    await queryRunner.query(
      `
      DELETE FROM \`order_promotions_promotion\`
      WHERE orderId NOT IN
      (
          SELECT DISTINCT id FROM \`order\`
      )
      `,
      undefined
    );

    await queryRunner.query(
      `
      DELETE FROM \`shipping_line\`
      WHERE orderId NOT IN
      (
          SELECT DISTINCT id FROM \`order\`
      )
      `,
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `zone_members_country` DROP FOREIGN KEY `FK_7350d77b6474313fbbaf4b094c1`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `zone_members_country` DROP FOREIGN KEY `FK_7baeecaf955e54bec73f998b0d5`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `asset_tags_tag` DROP FOREIGN KEY `FK_9e412b00d4c6cee1a4b3d920716`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `asset_tags_tag` DROP FOREIGN KEY `FK_fb5e800171ffbe9823f2cc727fd`",
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
      "ALTER TABLE `collection_product_variants_product_variant` DROP FOREIGN KEY `FK_6faa7b72422d9c4679e2f186ad1`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `collection_product_variants_product_variant` DROP FOREIGN KEY `FK_fb05887e2867365f236d7dd95ee`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `collection_channels_channel` DROP FOREIGN KEY `FK_7216ab24077cf5cbece7857dbbd`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `collection_channels_channel` DROP FOREIGN KEY `FK_cdbf33ffb5d4519161251520083`",
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
      "ALTER TABLE `facet_value_channels_channel` DROP FOREIGN KEY `FK_ad690c1b05596d7f52e52ffeedd`",
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
      "ALTER TABLE `product_facet_values_facet_value` DROP FOREIGN KEY `FK_6a0558e650d75ae639ff38e413a`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` DROP FOREIGN KEY `FK_26d12be3b5fec6c4adb1d792844`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` DROP FOREIGN KEY `FK_a51dfbd87c330c075c39832b6e7`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_variant_options_product_option` DROP FOREIGN KEY `FK_526f0131260eec308a3bd2b61b6`",
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
      "ALTER TABLE `product_variant_facet_values_facet_value` DROP FOREIGN KEY `FK_69567bc225b6bbbd732d6c5455b`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` DROP FOREIGN KEY `FK_beeb2b3cd800e589f2213ae99d6`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` DROP FOREIGN KEY `FK_d194bff171b62357688a5d0f559`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` DROP FOREIGN KEY `FK_bfd2a03e9988eda6a9d11760119`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` DROP FOREIGN KEY `FK_e09dfee62b158307404202b43a5`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_4be2f7adf862634f5f803d246b8`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_5f9286e6c25594c6b88c108db77`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `customer_groups_customer_group` DROP FOREIGN KEY `FK_85feea3f0e5e82133605f78db02`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `customer_groups_customer_group` DROP FOREIGN KEY `FK_b823a3c8bf3b78d3ed68736485c`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` DROP FOREIGN KEY `FK_a842c9fe8cd4c8ff31402d172d7`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` DROP FOREIGN KEY `FK_dc9f69207a8867f83b0fd257e30`",
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
      "ALTER TABLE `order_modification_order_items_order_item` DROP FOREIGN KEY `FK_9d631d7bd3d44af50eca535d728`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `order_modification_order_items_order_item` DROP FOREIGN KEY `FK_a48502a38aded69d087a8ec08ad`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` DROP FOREIGN KEY `FK_0eaaf0f4b6c69afde1e88ffb52d`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` DROP FOREIGN KEY `FK_6d9e2c39ab12391aaa374bcdaa4`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `shipping_method_channels_channel` DROP FOREIGN KEY `FK_f0a17b94aa5a162f0d422920eb2`",
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
      "ALTER TABLE `order_promotions_promotion` DROP FOREIGN KEY `FK_67be0e40122ab30a62a9817efe0`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `order_channels_channel` DROP FOREIGN KEY `FK_0d8e5c204480204a60e151e4853`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `order_channels_channel` DROP FOREIGN KEY `FK_d0d16db872499e83b15999f8c7a`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` DROP FOREIGN KEY `FK_5bcb569635ce5407eb3f264487d`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` DROP FOREIGN KEY `FK_c00e36f667d35031087b382e61b`",
      undefined
    );

    // Drop columns of disabled plugins - this data will be migrated separately
    await queryRunner.query(
      "ALTER TABLE `collection` DROP COLUMN `customFieldsSeodescription`",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product` DROP COLUMN `customFieldsProductrecommendationsenabled`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` DROP COLUMN `customFieldsBulkdiscountenabled`",
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
      "ALTER TABLE `fulfillment` CHANGE `handlerCode` `handlerCode` varchar(255) NOT NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method` CHANGE `fulfillmentHandlerCode` `fulfillmentHandlerCode` varchar(255) NOT NULL",
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
      "ALTER TABLE `zone_members_country` ADD CONSTRAINT `FK_7350d77b6474313fbbaf4b094c1` FOREIGN KEY (`zoneId`) REFERENCES `zone`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `zone_members_country` ADD CONSTRAINT `FK_7baeecaf955e54bec73f998b0d5` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_tags_tag` ADD CONSTRAINT `FK_9e412b00d4c6cee1a4b3d920716` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_tags_tag` ADD CONSTRAINT `FK_fb5e800171ffbe9823f2cc727fd` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_channels_channel` ADD CONSTRAINT `FK_dc4e7435f9f5e9e6436bebd33bb` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `asset_channels_channel` ADD CONSTRAINT `FK_16ca9151a5153f1169da5b7b7e3` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_product_variants_product_variant` ADD CONSTRAINT `FK_6faa7b72422d9c4679e2f186ad1` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_product_variants_product_variant` ADD CONSTRAINT `FK_fb05887e2867365f236d7dd95ee` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_channels_channel` ADD CONSTRAINT `FK_cdbf33ffb5d4519161251520083` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_channels_channel` ADD CONSTRAINT `FK_7216ab24077cf5cbece7857dbbd` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_channels_channel` ADD CONSTRAINT `FK_ca796020c6d097e251e5d6d2b02` FOREIGN KEY (`facetId`) REFERENCES `facet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_channels_channel` ADD CONSTRAINT `FK_2a8ea404d05bf682516184db7d3` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` ADD CONSTRAINT `FK_ad690c1b05596d7f52e52ffeedd` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` ADD CONSTRAINT `FK_e1d54c0b9db3e2eb17faaf5919c` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_facet_values_facet_value` ADD CONSTRAINT `FK_6a0558e650d75ae639ff38e413a` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_facet_values_facet_value` ADD CONSTRAINT `FK_06e7d73673ee630e8ec50d0b29f` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` ADD CONSTRAINT `FK_26d12be3b5fec6c4adb1d792844` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` ADD CONSTRAINT `FK_a51dfbd87c330c075c39832b6e7` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_options_product_option` ADD CONSTRAINT `FK_526f0131260eec308a3bd2b61b6` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_options_product_option` ADD CONSTRAINT `FK_e96a71affe63c97f7fa2f076dac` FOREIGN KEY (`productOptionId`) REFERENCES `product_option`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_facet_values_facet_value` ADD CONSTRAINT `FK_69567bc225b6bbbd732d6c5455b` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_facet_values_facet_value` ADD CONSTRAINT `FK_0d641b761ed1dce4ef3cd33d559` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` ADD CONSTRAINT `FK_beeb2b3cd800e589f2213ae99d6` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` ADD CONSTRAINT `FK_d194bff171b62357688a5d0f559` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` ADD CONSTRAINT `FK_bfd2a03e9988eda6a9d11760119` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` ADD CONSTRAINT `FK_e09dfee62b158307404202b43a5` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_5f9286e6c25594c6b88c108db77` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_groups_customer_group` ADD CONSTRAINT `FK_b823a3c8bf3b78d3ed68736485c` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_groups_customer_group` ADD CONSTRAINT `FK_85feea3f0e5e82133605f78db02` FOREIGN KEY (`customerGroupId`) REFERENCES `customer_group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` ADD CONSTRAINT `FK_a842c9fe8cd4c8ff31402d172d7` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` ADD CONSTRAINT `FK_dc9f69207a8867f83b0fd257e30` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item_fulfillments_fulfillment` ADD CONSTRAINT `FK_a568a3d5aa7f237edab624960b9` FOREIGN KEY (`orderItemId`) REFERENCES `order_item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_item_fulfillments_fulfillment` ADD CONSTRAINT `FK_8132041a647c28eb27ecc1691fa` FOREIGN KEY (`fulfillmentId`) REFERENCES `fulfillment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification_order_items_order_item` ADD CONSTRAINT `FK_a48502a38aded69d087a8ec08ad` FOREIGN KEY (`orderModificationId`) REFERENCES `order_modification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_modification_order_items_order_item` ADD CONSTRAINT `FK_9d631d7bd3d44af50eca535d728` FOREIGN KEY (`orderItemId`) REFERENCES `order_item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` ADD CONSTRAINT `FK_6d9e2c39ab12391aaa374bcdaa4` FOREIGN KEY (`promotionId`) REFERENCES `promotion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` ADD CONSTRAINT `FK_0eaaf0f4b6c69afde1e88ffb52d` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_channels_channel` ADD CONSTRAINT `FK_f0a17b94aa5a162f0d422920eb2` FOREIGN KEY (`shippingMethodId`) REFERENCES `shipping_method`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_channels_channel` ADD CONSTRAINT `FK_f2b98dfb56685147bed509acc3d` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_promotions_promotion` ADD CONSTRAINT `FK_67be0e40122ab30a62a9817efe0` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_promotions_promotion` ADD CONSTRAINT `FK_2c26b988769c0e3b0120bdef31b` FOREIGN KEY (`promotionId`) REFERENCES `promotion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_channels_channel` ADD CONSTRAINT `FK_0d8e5c204480204a60e151e4853` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_channels_channel` ADD CONSTRAINT `FK_d0d16db872499e83b15999f8c7a` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` ADD CONSTRAINT `FK_5bcb569635ce5407eb3f264487d` FOREIGN KEY (`paymentMethodId`) REFERENCES `payment_method`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` ADD CONSTRAINT `FK_c00e36f667d35031087b382e61b` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
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
      "ALTER TABLE `order_channels_channel` DROP FOREIGN KEY `FK_d0d16db872499e83b15999f8c7a`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_channels_channel` DROP FOREIGN KEY `FK_0d8e5c204480204a60e151e4853`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_promotions_promotion` DROP FOREIGN KEY `FK_2c26b988769c0e3b0120bdef31b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `order_promotions_promotion` DROP FOREIGN KEY `FK_67be0e40122ab30a62a9817efe0`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_channels_channel` DROP FOREIGN KEY `FK_f2b98dfb56685147bed509acc3d`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `shipping_method_channels_channel` DROP FOREIGN KEY `FK_f0a17b94aa5a162f0d422920eb2`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` DROP FOREIGN KEY `FK_0eaaf0f4b6c69afde1e88ffb52d`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` DROP FOREIGN KEY `FK_6d9e2c39ab12391aaa374bcdaa4`",
      undefined
    );
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
      "ALTER TABLE `customer_channels_channel` DROP FOREIGN KEY `FK_dc9f69207a8867f83b0fd257e30`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` DROP FOREIGN KEY `FK_a842c9fe8cd4c8ff31402d172d7`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_groups_customer_group` DROP FOREIGN KEY `FK_85feea3f0e5e82133605f78db02`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_groups_customer_group` DROP FOREIGN KEY `FK_b823a3c8bf3b78d3ed68736485c`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_4be2f7adf862634f5f803d246b8`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_5f9286e6c25594c6b88c108db77`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` DROP FOREIGN KEY `FK_e09dfee62b158307404202b43a5`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` DROP FOREIGN KEY `FK_bfd2a03e9988eda6a9d11760119`",
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
      "ALTER TABLE `product_variant_facet_values_facet_value` DROP FOREIGN KEY `FK_0d641b761ed1dce4ef3cd33d559`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_facet_values_facet_value` DROP FOREIGN KEY `FK_69567bc225b6bbbd732d6c5455b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_options_product_option` DROP FOREIGN KEY `FK_e96a71affe63c97f7fa2f076dac`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_options_product_option` DROP FOREIGN KEY `FK_526f0131260eec308a3bd2b61b6`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` DROP FOREIGN KEY `FK_a51dfbd87c330c075c39832b6e7`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` DROP FOREIGN KEY `FK_26d12be3b5fec6c4adb1d792844`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_facet_values_facet_value` DROP FOREIGN KEY `FK_06e7d73673ee630e8ec50d0b29f`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product_facet_values_facet_value` DROP FOREIGN KEY `FK_6a0558e650d75ae639ff38e413a`",
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
      "ALTER TABLE `collection_channels_channel` DROP FOREIGN KEY `FK_7216ab24077cf5cbece7857dbbd`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_channels_channel` DROP FOREIGN KEY `FK_cdbf33ffb5d4519161251520083`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_product_variants_product_variant` DROP FOREIGN KEY `FK_fb05887e2867365f236d7dd95ee`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `collection_product_variants_product_variant` DROP FOREIGN KEY `FK_6faa7b72422d9c4679e2f186ad1`",
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
      "ALTER TABLE `zone_members_country` DROP FOREIGN KEY `FK_7baeecaf955e54bec73f998b0d5`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `zone_members_country` DROP FOREIGN KEY `FK_7350d77b6474313fbbaf4b094c1`",
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
      'ALTER TABLE `shipping_method` CHANGE `fulfillmentHandlerCode` `fulfillmentHandlerCode` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NOT NULL DEFAULT \'manual-fulfillment\'',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `fulfillment` CHANGE `handlerCode` `handlerCode` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NOT NULL DEFAULT \'manual-fulfillment\'',
      undefined
    );

    // See comment above.
    //     await queryRunner.query(
    //       "ALTER TABLE `product` DROP COLUMN `customFieldsCustomizationoptions`",
    //       undefined
    //     );
    //     await queryRunner.query(
    //       'ALTER TABLE `product` ADD `customFieldsCustomizationoptions` text CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NULL',
    //       undefined
    //     );

    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD `customFieldsBulkdiscountenabled` tinyint NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `product` ADD `customFieldsProductrecommendationsenabled` tinyint NULL",
      undefined
    );

    await queryRunner.query(
      'ALTER TABLE `collection` ADD `customFieldsSeodescription` varchar(255) CHARACTER SET "utf8mb3" COLLATE "utf8mb3_general_ci" NULL',
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` ADD CONSTRAINT `FK_c00e36f667d35031087b382e61b` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `payment_method_channels_channel` ADD CONSTRAINT `FK_5bcb569635ce5407eb3f264487d` FOREIGN KEY (`paymentMethodId`) REFERENCES `payment_method`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `order_channels_channel` ADD CONSTRAINT `FK_d0d16db872499e83b15999f8c7a` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `order_channels_channel` ADD CONSTRAINT `FK_0d8e5c204480204a60e151e4853` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `order_promotions_promotion` ADD CONSTRAINT `FK_67be0e40122ab30a62a9817efe0` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `order_promotions_promotion` ADD CONSTRAINT `FK_2c26b988769c0e3b0120bdef31b` FOREIGN KEY (`promotionId`) REFERENCES `promotion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `shipping_method_channels_channel` ADD CONSTRAINT `FK_f2b98dfb56685147bed509acc3d` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `shipping_method_channels_channel` ADD CONSTRAINT `FK_f0a17b94aa5a162f0d422920eb2` FOREIGN KEY (`shippingMethodId`) REFERENCES `shipping_method`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` ADD CONSTRAINT `FK_6d9e2c39ab12391aaa374bcdaa4` FOREIGN KEY (`promotionId`) REFERENCES `promotion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `promotion_channels_channel` ADD CONSTRAINT `FK_0eaaf0f4b6c69afde1e88ffb52d` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
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

    await queryRunner.query(
      "ALTER TABLE `order_item_fulfillments_fulfillment` ADD CONSTRAINT `FK_a568a3d5aa7f237edab624960b9` FOREIGN KEY (`orderItemId`) REFERENCES `order_item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `order_item_fulfillments_fulfillment` ADD CONSTRAINT `FK_8132041a647c28eb27ecc1691fa` FOREIGN KEY (`fulfillmentId`) REFERENCES `fulfillment`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` ADD CONSTRAINT `FK_dc9f69207a8867f83b0fd257e30` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` ADD CONSTRAINT `FK_a842c9fe8cd4c8ff31402d172d7` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `customer_groups_customer_group` ADD CONSTRAINT `FK_b823a3c8bf3b78d3ed68736485c` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `customer_groups_customer_group` ADD CONSTRAINT `FK_85feea3f0e5e82133605f78db02` FOREIGN KEY (`customerGroupId`) REFERENCES `customer_group`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_5f9286e6c25594c6b88c108db77` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` ADD CONSTRAINT `FK_e09dfee62b158307404202b43a5` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `role_channels_channel` ADD CONSTRAINT `FK_bfd2a03e9988eda6a9d11760119` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` ADD CONSTRAINT `FK_d194bff171b62357688a5d0f559` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_variant_channels_channel` ADD CONSTRAINT `FK_beeb2b3cd800e589f2213ae99d6` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_variant_facet_values_facet_value` ADD CONSTRAINT `FK_69567bc225b6bbbd732d6c5455b` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_variant_facet_values_facet_value` ADD CONSTRAINT `FK_0d641b761ed1dce4ef3cd33d559` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_variant_options_product_option` ADD CONSTRAINT `FK_e96a71affe63c97f7fa2f076dac` FOREIGN KEY (`productOptionId`) REFERENCES `product_option`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_variant_options_product_option` ADD CONSTRAINT `FK_526f0131260eec308a3bd2b61b6` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` ADD CONSTRAINT `FK_a51dfbd87c330c075c39832b6e7` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_channels_channel` ADD CONSTRAINT `FK_26d12be3b5fec6c4adb1d792844` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_facet_values_facet_value` ADD CONSTRAINT `FK_6a0558e650d75ae639ff38e413a` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `product_facet_values_facet_value` ADD CONSTRAINT `FK_06e7d73673ee630e8ec50d0b29f` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` ADD CONSTRAINT `FK_e1d54c0b9db3e2eb17faaf5919c` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `facet_value_channels_channel` ADD CONSTRAINT `FK_ad690c1b05596d7f52e52ffeedd` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
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
      "ALTER TABLE `collection_channels_channel` ADD CONSTRAINT `FK_cdbf33ffb5d4519161251520083` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `collection_channels_channel` ADD CONSTRAINT `FK_7216ab24077cf5cbece7857dbbd` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `collection_product_variants_product_variant` ADD CONSTRAINT `FK_fb05887e2867365f236d7dd95ee` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `collection_product_variants_product_variant` ADD CONSTRAINT `FK_6faa7b72422d9c4679e2f186ad1` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
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
      "ALTER TABLE `asset_tags_tag` ADD CONSTRAINT `FK_fb5e800171ffbe9823f2cc727fd` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `asset_tags_tag` ADD CONSTRAINT `FK_9e412b00d4c6cee1a4b3d920716` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `zone_members_country` ADD CONSTRAINT `FK_7baeecaf955e54bec73f998b0d5` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    await queryRunner.query(
      "ALTER TABLE `zone_members_country` ADD CONSTRAINT `FK_7350d77b6474313fbbaf4b094c1` FOREIGN KEY (`zoneId`) REFERENCES `zone`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
  }
}
