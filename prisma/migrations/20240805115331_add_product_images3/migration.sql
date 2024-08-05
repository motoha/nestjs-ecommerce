/*
  Warnings:

  - You are about to drop the column `url` on the `productimage` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productimage` DROP COLUMN `url`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `image_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
