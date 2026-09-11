-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_membershipPlanId_fkey`;

-- AlterTable
ALTER TABLE `payment` MODIFY `membershipPlanId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_membershipPlanId_fkey` FOREIGN KEY (`membershipPlanId`) REFERENCES `membership_plan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
