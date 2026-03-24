import { z } from "zod";

export const AlertsStorageListSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(20),
  filters: z.object({
    estatus: z.string().optional(),
    nacionalidad: z.string().optional(),
    tipoAlerta: z.string().optional(),
  }).optional(),
});

export type AlertsStorageListInput = z.infer<typeof AlertsStorageListSchema>;

export const StorageAlertSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  pasaporte: z.string(),
  nacionalidad: z.string(),
  tipoAlerta: z.string(),
  descripcion: z.string(),
  fechaNacimiento: z.string().nullable(),
  lugarNacimiento: z.string().nullable(),
  genero: z.string().nullable(),
  fechaAlerta: z.string(),
  autoridadEmisora: z.string().nullable(),
  estatus: z.string(),
  fechaCreacion: z.string(),
  fechaActualizacion: z.string(),
  fechaUltimaBusqueda: z.string().nullable(),
  totalBusquedas: z.number(),
  archivoOrigen: z.string().nullable(),
  totalSubidas: z.number(),
  notasAdicionales: z.string().nullable(),
  activo: z.boolean(),
});

export type StorageAlert = z.infer<typeof StorageAlertSchema>;

export const AlertsStorageResponseSchema = z.object({
  alerts: z.array(StorageAlertSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export type AlertsStorageResponse = z.infer<typeof AlertsStorageResponseSchema>;
