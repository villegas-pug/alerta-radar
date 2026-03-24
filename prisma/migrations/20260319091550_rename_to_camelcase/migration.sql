/*
  Warnings:

  - You are about to drop the `SimAlertasMigratorias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SimAlertasMigratorias";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SimAlertaMigratoria" (
    "uId" TEXT NOT NULL PRIMARY KEY,
    "sNombre" TEXT NOT NULL,
    "sPasaporte" TEXT NOT NULL,
    "sNacionalidad" TEXT NOT NULL,
    "sTipoAlerta" TEXT NOT NULL,
    "sDescripcion" TEXT NOT NULL,
    "dFechaNacimiento" DATETIME,
    "sLugarNacimiento" TEXT,
    "sGenero" TEXT,
    "dFechaAlerta" DATETIME NOT NULL,
    "sAutoridadEmisora" TEXT,
    "sEstatus" TEXT NOT NULL DEFAULT 'ACTIVA',
    "dFechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dFechaActualizacion" DATETIME NOT NULL,
    "dFechaUltimaBusqueda" DATETIME,
    "nTotalBusquedas" INTEGER NOT NULL DEFAULT 0,
    "sArchivoOrigen" TEXT,
    "nTotalSubidas" INTEGER NOT NULL DEFAULT 0,
    "sNotasAdicionales" TEXT,
    "bActivo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE INDEX "SimAlertaMigratoria_sPasaporte_idx" ON "SimAlertaMigratoria"("sPasaporte");

-- CreateIndex
CREATE INDEX "SimAlertaMigratoria_sNacionalidad_idx" ON "SimAlertaMigratoria"("sNacionalidad");

-- CreateIndex
CREATE INDEX "SimAlertaMigratoria_sTipoAlerta_idx" ON "SimAlertaMigratoria"("sTipoAlerta");

-- CreateIndex
CREATE INDEX "SimAlertaMigratoria_dFechaAlerta_idx" ON "SimAlertaMigratoria"("dFechaAlerta");

-- CreateIndex
CREATE INDEX "SimAlertaMigratoria_sEstatus_idx" ON "SimAlertaMigratoria"("sEstatus");
