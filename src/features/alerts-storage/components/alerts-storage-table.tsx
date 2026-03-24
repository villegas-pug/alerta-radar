"use client";

import { useState, useEffect } from "react";
import { Loader2, Calendar, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type AlertsStorageResponse } from "@/features/alerts-storage/schemas/alerts-storage.schema";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AlertsStorageTable() {
  const [data, setData] = useState<AlertsStorageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    estatus: "",
    tipoAlerta: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (filters.estatus) params.append("estatus", filters.estatus);
      if (filters.tipoAlerta) params.append("tipoAlerta", filters.tipoAlerta);

      const response = await axios.get(`/api/alerts-storage?${params}`);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filtros</span>
          </div>
          <div className="flex gap-4">
            <Select
              value={filters.estatus}
              onValueChange={(value) => {
                setFilters((f) => ({ ...f, estatus: value === "all" ? "" : value }));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estatus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ACTIVA">Activa</SelectItem>
                <SelectItem value="INACTIVA">Inactiva</SelectItem>
                <SelectItem value="VENCIDA">Vencida</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.tipoAlerta}
              onValueChange={(value) => {
                setFilters((f) => ({ ...f, tipoAlerta: value === "all" ? "" : value }));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Alerta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="DETENCIÓN">Detención</SelectItem>
                <SelectItem value="BUSQUEDA">Búsqueda</SelectItem>
                <SelectItem value="EXPULSIÓN">Expulsión</SelectItem>
                <SelectItem value="ALERTA">Alerta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button variant="outline" onClick={() => fetchData()} disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : data ? (
        <>
          <p className="text-sm text-muted-foreground">
            Mostrando <strong>{data.alerts.length}</strong> de{" "}
            <strong>{data.total}</strong> registros
          </p>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Pasaporte</TableHead>
                  <TableHead>Nacionalidad</TableHead>
                  <TableHead>Tipo de Alerta</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Estatus</TableHead>
                  <TableHead>Búsquedas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.nombre}</TableCell>
                    <TableCell>{alert.pasaporte}</TableCell>
                    <TableCell>{alert.nacionalidad}</TableCell>
                    <TableCell>{alert.tipoAlerta}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {formatDate(alert.fechaCreacion)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          alert.estatus === "ACTIVA"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {alert.estatus}
                      </span>
                    </TableCell>
                    <TableCell>{alert.totalBusquedas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página {page} de {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= data.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No hay datos disponibles
        </div>
      )}
    </div>
  );
}
