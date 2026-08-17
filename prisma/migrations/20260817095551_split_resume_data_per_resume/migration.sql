-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `phone` VARCHAR(20) NULL,
    `googleId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `refreshToken` VARCHAR(500) NOT NULL,
    `expiresAt` DATETIME(0) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resume_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `templateKey` VARCHAR(191) NOT NULL,
    `preview` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `resume_templates_templateKey_key`(`templateKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resume_builder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `templateId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT 'My Resume',
    `fullName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `profilePhoto` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `zipCode` VARCHAR(191) NULL,
    `linkedin` VARCHAR(191) NULL,
    `github` VARCHAR(191) NULL,
    `summary` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `userId`(`userId`),
    INDEX `templateId`(`templateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resume_education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resumeId` INTEGER NOT NULL,
    `school` VARCHAR(191) NOT NULL,
    `degree` VARCHAR(191) NOT NULL,
    `educationLevel` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `gpa` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `resumeId`(`resumeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resume_experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resumeId` INTEGER NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `employmentType` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `resumeId`(`resumeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resume_skills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resumeId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `resumeId`(`resumeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resume_builder` ADD CONSTRAINT `resume_builder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resume_builder` ADD CONSTRAINT `resume_builder_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `resume_templates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resume_education` ADD CONSTRAINT `resume_education_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `resume_builder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resume_experience` ADD CONSTRAINT `resume_experience_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `resume_builder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resume_skills` ADD CONSTRAINT `resume_skills_resumeId_fkey` FOREIGN KEY (`resumeId`) REFERENCES `resume_builder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
