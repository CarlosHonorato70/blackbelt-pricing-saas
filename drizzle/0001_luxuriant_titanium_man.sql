CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`cnpj` varchar(18),
	`cnae` varchar(100),
	`companySize` varchar(50),
	`numberOfEmployees` int,
	`address` longtext,
	`contactName` varchar(100),
	`contactEmail` varchar(100),
	`contactPhone` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricing_parameters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`monthlyFixedCosts` decimal(10,2) NOT NULL,
	`monthlyProLabore` decimal(10,2) NOT NULL,
	`productiveHoursPerMonth` int NOT NULL,
	`unexpectedMarginPercent` decimal(5,2) NOT NULL,
	`taxMeiPercent` decimal(5,2) NOT NULL,
	`taxSimpleNationalPercent` decimal(5,2) NOT NULL,
	`taxAssumedProfitPercent` decimal(5,2) NOT NULL,
	`taxFreelancePercent` decimal(5,2) NOT NULL,
	`volumeDiscount6To15Percent` decimal(5,2) NOT NULL,
	`volumeDiscount16To30Percent` decimal(5,2) NOT NULL,
	`volumeDiscount30PlusPercent` decimal(5,2) NOT NULL,
	`customizationAdjustmentMinPercent` decimal(5,2) NOT NULL,
	`customizationAdjustmentMaxPercent` decimal(5,2) NOT NULL,
	`riskAdjustmentMinPercent` decimal(5,2) NOT NULL,
	`riskAdjustmentMaxPercent` decimal(5,2) NOT NULL,
	`seniorityAdjustmentMinPercent` decimal(5,2) NOT NULL,
	`seniorityAdjustmentMaxPercent` decimal(5,2) NOT NULL,
	`effectiveDate` timestamp NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pricing_parameters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposal_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` int NOT NULL,
	`serviceId` int NOT NULL,
	`quantity` int NOT NULL,
	`estimatedHours` decimal(8,2),
	`unitValue` decimal(10,2) NOT NULL,
	`volumeDiscount` decimal(5,2) DEFAULT '0',
	`customizationAdjustment` decimal(5,2) DEFAULT '0',
	`riskAdjustment` decimal(5,2) DEFAULT '0',
	`seniorityAdjustment` decimal(5,2) DEFAULT '0',
	`itemTotal` decimal(12,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proposal_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`proposalNumber` varchar(50) NOT NULL,
	`proposalDate` timestamp NOT NULL,
	`validityDays` int NOT NULL,
	`status` enum('draft','sent','accepted','rejected') NOT NULL DEFAULT 'draft',
	`totalValue` decimal(12,2) NOT NULL,
	`discountPercent` decimal(5,2) DEFAULT '0',
	`travelFee` decimal(10,2) DEFAULT '0',
	`taxRegime` varchar(50) NOT NULL,
	`notes` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`),
	CONSTRAINT `proposals_proposalNumber_unique` UNIQUE(`proposalNumber`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` longtext,
	`unit` varchar(50) NOT NULL,
	`minValue` decimal(10,2),
	`maxValue` decimal(10,2),
	`notes` longtext,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
