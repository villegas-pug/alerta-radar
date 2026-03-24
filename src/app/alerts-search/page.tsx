"use client";

import { Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertsSearchForm } from "@/features/alerts-search/components/alerts-search-form";
import { PageHeader } from "@/components/layout";

export default function AlertsSearchPage() {
  return (
    <>
      <PageHeader
        icon={Search}
        title="Búsqueda de Alertas"
        description="Busca alertas migratorias con soporte multi-campo y fuzzy search"
      />
      <div className="p-8">
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Registros</CardTitle>
              <CardDescription>
                Ingresa términos de búsqueda para encontrar alertas. Se buscan coincidencias en nombre,
                pasaporte, nacionalidad, tipo de alerta y descripción.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsSearchForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
