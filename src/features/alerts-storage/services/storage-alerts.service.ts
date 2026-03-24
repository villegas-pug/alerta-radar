import { prisma } from "@/lib/prisma/client";
import { ActionResult } from "@/types/action-result";
import { AlertsStorageResponseSchema, type AlertsStorageListInput } from "@/features/alerts-storage/schemas/alerts-storage.schema";

export async function listAlerts(
  input: AlertsStorageListInput
): Promise<ActionResult<{
  alerts: Array<{
    id: string;
    nombre: string;
    pasaporte: string;
    nacionalidad: string;
    tipoAlerta: string;
    descripcion: string;
    fechaNacimiento: string | null;
    lugarNacimiento: string | null;
    genero: string | null;
    fechaAlerta: string;
    autoridadEmisora: string | null;
    estatus: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    fechaUltimaBusqueda: string | null;
    totalBusquedas: number;
    archivoOrigen: string | null;
    totalSubidas: number;
    notasAdicionales: string | null;
    activo: boolean;
  }>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}>> {
  try {
    const { page = 1, pageSize = 20, filters } = input;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};

    if (filters?.estatus) {
      where.estatus = filters.estatus;
    }
    if (filters?.nacionalidad) {
      where.nacionalidad = { contains: filters.nacionalidad };
    }
    if (filters?.tipoAlerta) {
      where.tipoAlerta = filters.tipoAlerta;
    }

    const [alerts, total] = await Promise.all([
      prisma.alertaMigratoria.findMany({
        where,
        orderBy: { fechaCreacion: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.alertaMigratoria.count({ where }),
    ]);

    const validated = AlertsStorageResponseSchema.parse({
      alerts: alerts.map((alert) => ({
        ...alert,
        fechaNacimiento: alert.fechaNacimiento?.toISOString() || null,
        fechaAlerta: alert.fechaAlerta.toISOString(),
        fechaCreacion: alert.fechaCreacion.toISOString(),
        fechaActualizacion: alert.fechaActualizacion.toISOString(),
        fechaUltimaBusqueda: alert.fechaUltimaBusqueda?.toISOString() || null,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });

    return { ok: true, data: validated };
  } catch (error) {
    console.error("List alerts error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al listar alertas",
    };
  }
}

export async function getAlertById(
  id: string
): Promise<ActionResult<{
  id: string;
  nombre: string;
  pasaporte: string;
  nacionalidad: string;
  tipoAlerta: string;
  descripcion: string;
  fechaNacimiento: string | null;
  lugarNacimiento: string | null;
  genero: string | null;
  fechaAlerta: string;
  autoridadEmisora: string | null;
  estatus: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaUltimaBusqueda: string | null;
  totalBusquedas: number;
  archivoOrigen: string | null;
  totalSubidas: number;
  notasAdicionales: string | null;
  activo: boolean;
}>> {
  try {
    const alert = await prisma.alertaMigratoria.findUnique({
      where: { id },
    });

    if (!alert) {
      return { ok: false, error: "Alerta no encontrada" };
    }

    return {
      ok: true,
      data: {
        ...alert,
        fechaNacimiento: alert.fechaNacimiento?.toISOString() || null,
        fechaAlerta: alert.fechaAlerta.toISOString(),
        fechaCreacion: alert.fechaCreacion.toISOString(),
        fechaActualizacion: alert.fechaActualizacion.toISOString(),
        fechaUltimaBusqueda: alert.fechaUltimaBusqueda?.toISOString() || null,
      },
    };
  } catch (error) {
    console.error("Get alert error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al obtener alerta",
    };
  }
}

export async function updateAlertStatus(
  id: string,
  estatus: string
): Promise<ActionResult<{ success: boolean }>> {
  try {
    await prisma.alertaMigratoria.update({
      where: { id },
      data: { estatus },
    });

    return { ok: true, data: { success: true } };
  } catch (error) {
    console.error("Update alert status error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al actualizar estado",
    };
  }
}
