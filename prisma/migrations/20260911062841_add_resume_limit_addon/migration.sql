-- AlterTable
ALTER TABLE `payment` ADD COLUMN `resumeLimitAddonId` INTEGER NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'MEMBERSHIP';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `extraResumeLimit` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `resume_limit_addon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `extraLimit` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `payment_resumeLimitAddonId_idx` ON `payment`(`resumeLimitAddonId`);

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_resumeLimitAddonId_fkey` FOREIGN KEY (`resumeLimitAddonId`) REFERENCES `resume_limit_addon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
