import { prisma } from "@/lib/prisma/client";
import { ActionResult } from "@/types/action-result";

export interface DashboardStats {
  totalAlerts: number;
  uploadsCount: number;
  searchesCount: number;
  activeRecords: number;
}

export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  try {
    const [totalAlerts, uniqueFilesResult, searchesResult] = await Promise.all([
      prisma.alertaMigratoria.count({
        where: { activo: true },
      }),
      prisma.alertaMigratoria.groupBy({
        by: ["archivoOrigen"],
        where: { archivoOrigen: { not: null } },
        _count: { archivoOrigen: true },
      }),
      prisma.alertaMigratoria.aggregate({
        _sum: { totalBusquedas: true },
      }),
    ]);

    return {
      ok: true,
      data: {
        totalAlerts,
        uploadsCount: uniqueFilesResult.length,
        searchesCount: searchesResult._sum.totalBusquedas || 0,
        activeRecords: totalAlerts,
      },
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al obtener estadísticas",
    };
  }
}
