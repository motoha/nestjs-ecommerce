-- AlterTable
ALTER TABLE `productecom` ADD COLUMN `brand_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `Color` (
    `color_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`color_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Brand` (
    `brand_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`brand_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Size` (
    `size_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`size_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductColor` (
    `product_id` INTEGER NOT NULL,
    `color_id` INTEGER NOT NULL,

    PRIMARY KEY (`product_id`, `color_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductSize` (
    `product_id` INTEGER NOT NULL,
    `size_id` INTEGER NOT NULL,

    PRIMARY KEY (`product_id`, `size_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductEcom` ADD CONSTRAINT `ProductEcom_brand_id_fkey` FOREIGN KEY (`brand_id`) REFERENCES `Brand`(`brand_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductColor` ADD CONSTRAINT `ProductColor_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `ProductEcom`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductColor` ADD CONSTRAINT `ProductColor_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `ProductEcom`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_size_id_fkey` FOREIGN KEY (`size_id`) REFERENCES `Size`(`size_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
