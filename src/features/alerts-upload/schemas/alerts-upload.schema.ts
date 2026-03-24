import { z } from "zod";

export const AlertsUploadSchema = z.object({
  file: z.instanceof(File, { message: "Debe seleccionar un archivo" }),
});

export type AlertsUploadInput = z.infer<typeof AlertsUploadSchema>;

export const AlertRowSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  pasaporte: z.string().min(1, "El pasaporte es requerido"),
  nacionalidad: z.string().min(1, "La nacionalidad es requerida"),
  tipoAlerta: z.string().min(1, "El tipo de alerta es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  fechaNacimiento: z.string().optional(),
  lugarNacimiento: z.string().optional(),
  genero: z.string().optional(),
  fechaAlerta: z.string().optional(),
  autoridadEmisora: z.string().optional(),
});

export type AlertRow = z.infer<typeof AlertRowSchema>;

export const AlertsUploadResponseSchema = z.object({
  totalRows: z.number(),
  successCount: z.number(),
  errorCount: z.number(),
  errors: z.array(z.object({
    row: z.number(),
    message: z.string(),
  })),
});

export type AlertsUploadResponse = z.infer<typeof AlertsUploadResponseSchema>;
