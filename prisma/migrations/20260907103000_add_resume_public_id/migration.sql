-- AlterTable
ALTER TABLE `resume_builder` ADD COLUMN `publicId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `resume_builder_publicId_key` ON `resume_builder`(`publicId`);