/*
  Warnings:

  - You are about to drop the `_productimagetouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_productimagetouser` DROP FOREIGN KEY `_ProductImageToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_productimagetouser` DROP FOREIGN KEY `_ProductImageToUser_B_fkey`;

-- DropTable
DROP TABLE `_productimagetouser`;
