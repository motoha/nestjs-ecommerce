-- AlterTable
ALTER TABLE `user` ADD COLUMN `address_line1` VARCHAR(191) NULL,
    ADD COLUMN `address_line2` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `postal_code` VARCHAR(191) NULL,
    ADD COLUMN `state` VARCHAR(191) NULL;
