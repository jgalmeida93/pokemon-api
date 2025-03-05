/*
  Warnings:

  - A unique constraint covering the columns `[pokeApiId]` on the table `Pokemon` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokeApiId_key" ON "Pokemon"("pokeApiId");
