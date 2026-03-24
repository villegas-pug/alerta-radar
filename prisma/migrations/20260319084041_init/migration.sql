-- CreateTable
CREATE TABLE "SimAlertasMigratorias" (
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
CREATE INDEX "SimAlertasMigratorias_sPasaporte_idx" ON "SimAlertasMigratorias"("sPasaporte");

-- CreateIndex
CREATE INDEX "SimAlertasMigratorias_sNacionalidad_idx" ON "SimAlertasMigratorias"("sNacionalidad");

-- CreateIndex
CREATE INDEX "SimAlertasMigratorias_sTipoAlerta_idx" ON "SimAlertasMigratorias"("sTipoAlerta");

-- CreateIndex
CREATE INDEX "SimAlertasMigratorias_dFechaAlerta_idx" ON "SimAlertasMigratorias"("dFechaAlerta");

-- CreateIndex
CREATE INDEX "SimAlertasMigratorias_sEstatus_idx" ON "SimAlertasMigratorias"("sEstatus");
