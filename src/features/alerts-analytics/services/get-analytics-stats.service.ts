import { prisma } from "@/lib/prisma/client"
import { ActionResult } from "@/types/action-result"
import type { AnalyticsStats, AgeGroupData } from "../types/analytics.types"

function calculateAgeGroups(
  birthDates: Array<{ fechaNacimiento: Date | null }>
): AgeGroupData[] {
  const now = new Date()
  const groups = {
    "0-17": 0,
    "18-30": 0,
    "31-50": 0,
    "51-70": 0,
    "70+": 0,
  }

  for (const record of birthDates) {
    if (!record.fechaNacimiento) continue
    const age = Math.floor(
      (now.getTime() - record.fechaNacimiento.getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    )
    if (age < 18) groups["0-17"]++
    else if (age <= 30) groups["18-30"]++
    else if (age <= 50) groups["31-50"]++
    else if (age <= 70) groups["51-70"]++
    else groups["70+"]++
  }

  return Object.entries(groups).map(([grupo, count]) => ({ grupo, count }))
}

function getMonthName(date: Date): string {
  return date.toLocaleDateString("es-ES", { month: "short", year: "2-digit" })
}

export async function getAnalyticsStats(): Promise<ActionResult<AnalyticsStats>> {
  try {
    const [
      totalAlerts,
      activeAlerts,
      uniqueFiles,
      searchesSum,
      alertsByType,
      nationalities,
      genderDistribution,
      birthDates,
      authorities,
      timelineData,
    ] = await Promise.all([
      prisma.alertaMigratoria.count(),
      prisma.alertaMigratoria.count({ where: { activo: true, estatus: "ACTIVA" } }),
      prisma.alertaMigratoria.groupBy({
        by: ["archivoOrigen"],
        where: { archivoOrigen: { not: null } },
        _count: { archivoOrigen: true },
      }),
      prisma.alertaMigratoria.aggregate({ _sum: { totalBusquedas: true } }),
      prisma.alertaMigratoria.groupBy({
        by: ["tipoAlerta"],
        _count: { tipoAlerta: true },
        orderBy: { _count: { tipoAlerta: "desc" } },
      }),
      prisma.alertaMigratoria.groupBy({
        by: ["nacionalidad"],
        _count: { nacionalidad: true },
        orderBy: { _count: { nacionalidad: "desc" } },
        take: 10,
      }),
      prisma.alertaMigratoria.groupBy({
        by: ["genero"],
        _count: { genero: true },
        where: { genero: { not: null } },
      }),
      prisma.alertaMigratoria.findMany({
        select: { fechaNacimiento: true },
        where: { fechaNacimiento: { not: null } },
      }),
      prisma.alertaMigratoria.groupBy({
        by: ["autoridadEmisora"],
        _count: { autoridadEmisora: true },
        orderBy: { _count: { autoridadEmisora: "desc" } },
        take: 5,
        where: { autoridadEmisora: { not: null } },
      }),
      prisma.$queryRaw<Array<{ mes: string; count: bigint }>>`
        SELECT strftime('%Y-%m', dFechaAlerta) as mes, COUNT(*) as count
        FROM SimAlertaMigratoria
        WHERE strftime('%Y', dFechaAlerta) = strftime('%Y', 'now')
        GROUP BY strftime('%Y-%m', dFechaAlerta)
        ORDER BY mes ASC
      `,
    ])

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const monthsMap = new Map<string, number>()

    for (let month = 0; month <= currentMonth; month++) {
      const d = new Date(currentYear, month, 1)
      monthsMap.set(d.toISOString().slice(0, 7), 0)
    }

    for (const row of timelineData) {
      if (monthsMap.has(row.mes)) {
        monthsMap.set(row.mes, Number(row.count))
      }
    }

    const timeline = Array.from(monthsMap.entries()).map(([mes, count]) => ({
      mes: getMonthName(new Date(mes + "-01")),
      count,
    }))

    return {
      ok: true,
      data: {
        kpis: {
          totalAlerts,
          activeAlerts,
          uploadsCount: uniqueFiles.length,
          searchesCount: searchesSum._sum.totalBusquedas || 0,
        },
        alertsByType: alertsByType.map((t) => ({
          tipo: t.tipoAlerta,
          count: t._count.tipoAlerta,
        })),
        topNationalities: nationalities.map((n) => ({
          nacionalidad: n.nacionalidad,
          count: n._count.nacionalidad,
        })),
        ageGroups: calculateAgeGroups(birthDates),
        genderDistribution: genderDistribution.map((g) => ({
          genero: g.genero || "No especificado",
          count: g._count.genero,
        })),
        timeline,
        byAuthority: authorities.map((a) => ({
          autoridad: a.autoridadEmisora || "No especificado",
          count: a._count.autoridadEmisora,
        })),
      },
    }
  } catch (error) {
    console.error("Analytics stats error:", error)
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al obtener estadísticas",
    }
  }
}
