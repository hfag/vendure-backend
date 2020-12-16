import { MigrationInterface, QueryRunner } from "typeorm";

export class v0161608057253847 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TABLE `customer_channels_channel` (`customerId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_a842c9fe8cd4c8ff31402d172d` (`customerId`), INDEX `IDX_dc9f69207a8867f83b0fd257e3` (`channelId`), PRIMARY KEY (`customerId`, `channelId`)) ENGINE=InnoDB",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `fulfillment` ADD `state` varchar(255) NOT NULL DEFAULT 'Delivered'",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `session` ADD `activeChannelId` int NULL",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `session` ADD CONSTRAINT `FK_eb87ef1e234444728138302263b` FOREIGN KEY (`activeChannelId`) REFERENCES `channel`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` ADD CONSTRAINT `FK_a842c9fe8cd4c8ff31402d172d7` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` ADD CONSTRAINT `FK_dc9f69207a8867f83b0fd257e30` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
      undefined
    );

    // Assuming the ID of the default Channel is 1.
    // If you are using a UUID strategy, replace 1 with
    // the ID of the default channel.
    await queryRunner.query(
      "INSERT INTO `customer_channels_channel` (customerId, channelId) SELECT id, 1 FROM `customer`",
      undefined
    );
    // The Order "Fulfilled" state is now named "Delivered"
    await queryRunner.query(
      "UPDATE `order` SET `state`='Delivered' WHERE `state`='Fulfilled'",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` DROP FOREIGN KEY `FK_dc9f69207a8867f83b0fd257e30`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `customer_channels_channel` DROP FOREIGN KEY `FK_a842c9fe8cd4c8ff31402d172d7`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `session` DROP FOREIGN KEY `FK_eb87ef1e234444728138302263b`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `session` DROP COLUMN `activeChannelId`",
      undefined
    );
    await queryRunner.query(
      "ALTER TABLE `fulfillment` DROP COLUMN `state`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_dc9f69207a8867f83b0fd257e3` ON `customer_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP INDEX `IDX_a842c9fe8cd4c8ff31402d172d` ON `customer_channels_channel`",
      undefined
    );
    await queryRunner.query(
      "DROP TABLE `customer_channels_channel`",
      undefined
    );
  }
}
