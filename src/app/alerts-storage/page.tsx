"use client";

import { Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertsStorageTable } from "@/features/alerts-storage/components/alerts-storage-table";
import { PageHeader } from "@/components/layout";

export default function AlertsStoragePage() {
  return (
    <>
      <PageHeader
        icon={Database}
        title="Gestión de Almacenamiento"
        description="Administra y da seguimiento a los registros almacenados"
      />
      <div className="p-8">
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Registros Almacenados</CardTitle>
              <CardDescription>
                Vista completa de todas las alertas migratorias almacenadas en el sistema.
                Puedes filtrar, ordenar y gestionar cada registro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsStorageTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
