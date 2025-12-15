/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Sponsored` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client` to the `Sponsored` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Sponsored` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sponsored" ADD COLUMN     "client" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sponsored_slug_key" ON "Sponsored"("slug");
