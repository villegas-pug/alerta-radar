"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertsUploadSchema,
  type AlertsUploadInput,
  type AlertsUploadResponse,
} from "@/features/alerts-upload/schemas/alerts-upload.schema";

export function AlertsUploadForm() {
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<AlertsUploadResponse | null>(null);

  const form = useForm<AlertsUploadInput>({
    resolver: zodResolver(AlertsUploadSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = async (data: AlertsUploadInput) => {
    setIsUploading(true);
    setUploadStatus(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", data.file);

      const response = await axios.post("/api/alerts-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data as AlertsUploadResponse;
      setUploadResult(result);

      if (result.errorCount === 0) {
        setUploadStatus({
          type: "success",
          message: `Se importaron ${result.successCount} alertas correctamente`,
        });
      } else if (result.successCount > 0) {
        setUploadStatus({
          type: "success",
          message: `Se importaron ${result.successCount} alertas, ${result.errorCount} errores`,
        });
      } else {
        setUploadStatus({
          type: "error",
          message: "No se pudo importar ninguna alerta",
        });
      }
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Error al subir el archivo",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Archivo CSV o Excel</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                    disabled={isUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isUploading}>
            {isUploading ? (
              <>Procesando...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importar Alertas
              </>
            )}
          </Button>
        </form>
      </Form>

      {uploadStatus && (
        <div
          className={`p-4 rounded-md flex items-start gap-3 ${
            uploadStatus.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {uploadStatus.type === "success" ? (
            <CheckCircle className="h-5 w-5 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 mt-0.5" />
          )}
          <div>
            <p className="font-medium">{uploadStatus.message}</p>
            {uploadResult && uploadResult.errors.length > 0 && (
              <div className="mt-2 text-sm">
                <p className="font-medium">Errores:</p>
                <ul className="list-disc list-inside mt-1">
                  {uploadResult.errors.slice(0, 10).map((error) => (
                    <li key={error.row}>
                      Fila {error.row}: {error.message}
                    </li>
                  ))}
                  {uploadResult.errors.length > 10 && (
                    <li>... y {uploadResult.errors.length - 10} errores más</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
