-- AlterTable
ALTER TABLE "Jobapply" ADD COLUMN     "usuarioId" INTEGER;

-- AddForeignKey
ALTER TABLE "Jobapply" ADD CONSTRAINT "Jobapply_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
