/*
  Warnings:

  - You are about to drop the column `installation` on the `github_installation` table. All the data in the column will be lost.
  - Added the required column `installationId` to the `github_installation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "github_installation" DROP COLUMN "installation",
ADD COLUMN     "installationId" INTEGER NOT NULL;
