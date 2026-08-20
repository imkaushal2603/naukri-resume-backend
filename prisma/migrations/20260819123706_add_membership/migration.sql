-- CreateTable
CREATE TABLE `membership` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `membershipPlanId` INTEGER NOT NULL,
    `paymentId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `membership_paymentId_key`(`paymentId`),
    INDEX `membership_userId_idx`(`userId`),
    INDEX `membership_membershipPlanId_idx`(`membershipPlanId`),
    INDEX `membership_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `membership` ADD CONSTRAINT `membership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membership` ADD CONSTRAINT `membership_membershipPlanId_fkey` FOREIGN KEY (`membershipPlanId`) REFERENCES `membership_plan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
