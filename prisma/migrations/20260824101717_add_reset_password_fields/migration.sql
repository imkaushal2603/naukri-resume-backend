-- AlterTable
ALTER TABLE `resume_builder` ADD COLUMN `previewImage` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `resetPasswordExpires` DATETIME(3) NULL,
    ADD COLUMN `resetPasswordToken` VARCHAR(255) NULL;
