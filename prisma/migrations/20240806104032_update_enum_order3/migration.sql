-- AlterTable
ALTER TABLE `order` ADD COLUMN `status_id` INTEGER NULL,
    MODIFY `user_id` INTEGER NOT NULL DEFAULT 1;
