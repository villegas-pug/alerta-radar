"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search as SearchIcon, Loader2, Calendar, AlertTriangle } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertsSearchSchema,
  type AlertsSearchInput,
  type AlertsSearchResponse,
} from "@/features/alerts-search/schemas/alerts-search.schema";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AlertsSearchForm() {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<AlertsSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<AlertsSearchInput>({
    resolver: zodResolver(AlertsSearchSchema),
    defaultValues: {
      query: "",
      page: 1,
    },
  });

  const onSubmit = async (data: AlertsSearchInput) => {
    setIsSearching(true);
    setError(null);
    setCurrentPage(data.page);

    try {
      const response = await axios.get("/api/alerts-search", {
        params: {
          query: data.query,
          page: data.page,
        },
      });

      const result = response.data as AlertsSearchResponse;
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en la búsqueda");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    form.setValue("page", newPage);
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Buscar por nombre, pasaporte, nacionalidad..."
                    {...field}
                    disabled={isSearching}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
            <span className="ml-2">Buscar</span>
          </Button>
        </form>
      </Form>

      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-800 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Se encontraron <strong>{results.total}</strong> resultados
          </p>

          {results.results.length > 0 ? (
            <>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Pasaporte</TableHead>
                      <TableHead>Nacionalidad</TableHead>
                      <TableHead>Tipo de Alerta</TableHead>
                      <TableHead>Fecha de Alerta</TableHead>
                      <TableHead>Estatus</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.nombre}</TableCell>
                        <TableCell>{result.pasaporte}</TableCell>
                        <TableCell>{result.nacionalidad}</TableCell>
                        <TableCell>{result.tipoAlerta}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {formatDate(result.fechaAlerta)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              result.estatus === "ACTIVA"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {result.estatus}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {results.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Anterior
                  </Button>
                  <span className="flex items-center px-4">
                    Página {currentPage} de {results.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= results.totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
}
