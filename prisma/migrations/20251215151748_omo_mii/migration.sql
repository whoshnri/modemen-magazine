/*
  Warnings:

  - Added the required column `viewLink` to the `Issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issues" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "viewLink" TEXT NOT NULL;
