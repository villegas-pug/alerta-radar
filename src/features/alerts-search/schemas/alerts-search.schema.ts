import { z } from "zod";

export const AlertsSearchSchema = z.object({
  query: z.string().min(1, "Ingresa un término de búsqueda"),
  page: z.number().int().positive(),
});

export type AlertsSearchInput = z.infer<typeof AlertsSearchSchema>;

export const AlertResultSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  pasaporte: z.string(),
  nacionalidad: z.string(),
  tipoAlerta: z.string(),
  descripcion: z.string(),
  fechaAlerta: z.string(),
  estatus: z.string(),
  score: z.number(),
});

export type AlertResult = z.infer<typeof AlertResultSchema>;

export const AlertsSearchResponseSchema = z.object({
  results: z.array(AlertResultSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export type AlertsSearchResponse = z.infer<typeof AlertsSearchResponseSchema>;
