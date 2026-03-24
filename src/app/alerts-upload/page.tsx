"use client";

import { Upload, Download, FileSpreadsheet, Table } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertsUploadForm } from "@/features/alerts-upload/components/alerts-upload-form";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout";

const FILE_STRUCTURE = [
  { column: "nombre", type: "Texto", required: true, description: "Nombre completo de la persona" },
  { column: "pasaporte", type: "Texto", required: true, description: "Número de pasaporte" },
  { column: "nacionalidad", type: "Texto", required: true, description: "País de nacionalidad" },
  { column: "tipoAlerta", type: "Texto", required: true, description: "BUSQUEDA, DETENCION, EXPULSION, ALERTA" },
  { column: "descripcion", type: "Texto", required: true, description: "Descripción detallada de la alerta" },
  { column: "fechaNacimiento", type: "Fecha", required: false, description: "Formato: YYYY-MM-DD" },
  { column: "lugarNacimiento", type: "Texto", required: false, description: "Ciudad/País de nacimiento" },
  { column: "genero", type: "Texto", required: false, description: "Masculino / Femenino" },
  { column: "fechaAlerta", type: "Fecha", required: false, description: "Fecha de emisión (YYYY-MM-DD)" },
  { column: "autoridadEmisora", type: "Texto", required: false, description: "Institución que emite la alerta" },
];

export default function AlertsUploadPage() {
  return (
    <>
      <PageHeader
        icon={Upload}
        title="Carga Masiva de Alertas"
        description="Importa alertas migratorias desde archivos CSV o Excel"
      />
      <div className="p-8">
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Descargar Plantilla
              </CardTitle>
              <CardDescription>
                Archivo Excel con la estructura correcta y 5 registros de prueba para referencia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button asChild>
                  <a href="/features/alerts-upload/assets/template.xlsx" download="plantilla-alertas.xlsx">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Descargar XLSX
                  </a>
                </Button>
                <span className="text-sm text-muted-foreground">
                  plantilla-alertas.xlsx (5 registros de prueba)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Estructura del Archivo
              </CardTitle>
              <CardDescription>
                Columnas requeridas y opcionales para la carga masiva.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Columna</th>
                      <th className="px-4 py-3 text-left font-medium">Tipo</th>
                      <th className="px-4 py-3 text-left font-medium">Requerido</th>
                      <th className="px-4 py-3 text-left font-medium">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FILE_STRUCTURE.map((field, index) => (
                      <tr key={field.column} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                        <td className="px-4 py-3 font-mono font-medium">{field.column}</td>
                        <td className="px-4 py-3 text-muted-foreground">{field.type}</td>
                        <td className="px-4 py-3">
                          {field.required ? (
                            <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 font-medium">
                              Sí
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{field.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Subir Archivo
              </CardTitle>
              <CardDescription>
                Selecciona un archivo CSV o Excel (.xlsx, .xls) con los registros a importar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsUploadForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
