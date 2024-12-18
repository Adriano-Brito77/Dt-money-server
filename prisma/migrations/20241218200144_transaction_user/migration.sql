/*
  Warnings:

  - Added the required column `user` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "user" TEXT NOT NULL;
