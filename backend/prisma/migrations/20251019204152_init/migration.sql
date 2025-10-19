-- CreateEnum
CREATE TYPE "RequirementType" AS ENUM ('SYS', 'SWE');

-- CreateEnum
CREATE TYPE "ProcessStep" AS ENUM ('SYS_1', 'SYS_2', 'SYS_3', 'SYS_4', 'SYS_5', 'SWE_1', 'SWE_2', 'SWE_3', 'SWE_4', 'SWE_5', 'SWE_6');

-- CreateEnum
CREATE TYPE "RequirementStatus" AS ENUM ('DRAFT', 'APPROVED', 'IMPLEMENTED', 'VERIFIED', 'VALIDATED');

-- CreateEnum
CREATE TYPE "TraceRelation" AS ENUM ('DERIVES', 'SATISFIES', 'VERIFIES', 'VALIDATES');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('VERIFICATION', 'VALIDATION');

-- CreateEnum
CREATE TYPE "TestResult" AS ENUM ('PASS', 'FAIL', 'BLOCKED', 'NA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "RequirementType" NOT NULL,
    "processStep" "ProcessStep" NOT NULL,
    "status" "RequirementStatus" NOT NULL DEFAULT 'DRAFT',
    "priority" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdById" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraceLink" (
    "id" SERIAL NOT NULL,
    "fromRequirementId" INTEGER NOT NULL,
    "toRequirementId" INTEGER NOT NULL,
    "relation" "TraceRelation" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TraceLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "requirementId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "uploadedById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" SERIAL NOT NULL,
    "requirementId" INTEGER NOT NULL,
    "type" "EvidenceType" NOT NULL,
    "method" TEXT,
    "result" "TestResult",
    "notes" TEXT,
    "attachmentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Requirement_code_key" ON "Requirement"("code");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraceLink" ADD CONSTRAINT "TraceLink_fromRequirementId_fkey" FOREIGN KEY ("fromRequirementId") REFERENCES "Requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraceLink" ADD CONSTRAINT "TraceLink_toRequirementId_fkey" FOREIGN KEY ("toRequirementId") REFERENCES "Requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
