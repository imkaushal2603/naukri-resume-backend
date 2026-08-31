-- AlterTable
ALTER TABLE `resume_templates` ADD COLUMN `categories` JSON NULL,
    ADD COLUMN `tier` VARCHAR(191) NOT NULL DEFAULT 'free';
