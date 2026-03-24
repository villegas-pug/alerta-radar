"use client";

import { useEffect, useState } from "react";
import { Shield, Upload, Search, Database, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout";

interface DashboardStats {
  totalAlerts: number;
  uploadsCount: number;
  searchesCount: number;
  activeRecords: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (data.ok) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="Bienvenido a ARAM - Alerta Radar de Alertas Migratorias"
      />
      <div className="p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats?.totalAlerts ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Registros en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cargas Realizadas</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats?.uploadsCount ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Archivos importados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Búsquedas</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats?.searchesCount ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Consultas realizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En Almacenamiento</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats?.activeRecords ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Registros activos
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenido</CardTitle>
              <CardDescription>
                Selecciona una opción del menú lateral para comenzar a trabajar
                con las alertas migratorias.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border bg-muted/50">
                  <h3 className="font-medium mb-1">Carga Masiva</h3>
                  <p className="text-sm text-muted-foreground">
                    Importa alertas desde archivos CSV o Excel
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/50">
                  <h3 className="font-medium mb-1">Búsqueda Inteligente</h3>
                  <p className="text-sm text-muted-foreground">
                    Busca alertas con fuzzy search y ranking
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/50">
                  <h3 className="font-medium mb-1">Gestión de Registros</h3>
                  <p className="text-sm text-muted-foreground">
                    Administra los registros almacenados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
