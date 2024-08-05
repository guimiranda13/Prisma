/*
  Warnings:

  - You are about to drop the `ProductCart` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "valor_total" DROP NOT NULL,
ALTER COLUMN "valor_total" DROP DEFAULT;

-- DropTable
DROP TABLE "ProductCart";
