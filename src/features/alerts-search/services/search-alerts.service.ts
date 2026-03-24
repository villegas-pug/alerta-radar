import { elasticClient, ALERTS_INDEX } from "@/lib/elasticsearch/client";
import { prisma } from "@/lib/prisma/client";
import { ActionResult } from "@/types/action-result";
import { AlertsSearchResponseSchema, type AlertsSearchInput } from "@/features/alerts-search/schemas/alerts-search.schema";

const PAGE_SIZE = 20;

interface AlertDocument {
  id: string;
  nombre: string;
  pasaporte: string;
  nacionalidad: string;
  tipoAlerta: string;
  descripcion: string;
  fechaAlerta: string;
  fechaCreacion: string;
  estatus: string;
}

export async function searchAlerts(
  input: AlertsSearchInput
): Promise<ActionResult<{
  results: Array<{
    id: string;
    nombre: string;
    pasaporte: string;
    nacionalidad: string;
    tipoAlerta: string;
    descripcion: string;
    fechaAlerta: string;
    estatus: string;
    score: number;
  }>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}>> {
  try {
    const { query, page = 1 } = input;
    const from = (page - 1) * PAGE_SIZE;

    const response = await elasticClient.search({
      index: ALERTS_INDEX,
      from,
      size: PAGE_SIZE,
      query: {
        bool: {
          should: [
            { match: { nombre: { query, boost: 3, fuzziness: "AUTO" } } },
            { term: { pasaporte: { value: query, boost: 3 } } },
            { match: { nacionalidad: { query, boost: 2, fuzziness: "AUTO" } } },
            { term: { tipoAlerta: { value: query, boost: 2 } } },
            { match: { descripcion: { query, boost: 1, fuzziness: "AUTO" } } },
          ],
          minimum_should_match: 1,
        },
      },
      sort: [
        { _score: { order: "desc" } as { order: "desc" } },
        { fechaCreacion: { order: "desc" } as { order: "desc" } },
      ],
    });

    const total = typeof response.hits.total === "number" 
      ? response.hits.total 
      : response.hits.total?.value ?? 0;

    const results: Array<{
      id: string;
      nombre: string;
      pasaporte: string;
      nacionalidad: string;
      tipoAlerta: string;
      descripcion: string;
      fechaAlerta: string;
      estatus: string;
      score: number;
    }> = [];

    for (const hit of response.hits.hits) {
      const source = hit._source as AlertDocument | undefined;
      if (source) {
        results.push({
          id: source.id,
          nombre: source.nombre,
          pasaporte: source.pasaporte,
          nacionalidad: source.nacionalidad,
          tipoAlerta: source.tipoAlerta,
          descripcion: source.descripcion,
          fechaAlerta: source.fechaAlerta,
          estatus: source.estatus,
          score: hit._score ?? 0,
        });
      }
    }

    if (results.length > 0) {
      const ids = results.map((r) => r.id);
      await prisma.alertaMigratoria.updateMany({
        where: { id: { in: ids } },
        data: {
          fechaUltimaBusqueda: new Date(),
          totalBusquedas: { increment: 1 },
        },
      });
    }

    const validated = AlertsSearchResponseSchema.parse({
      results,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });

    return { ok: true, data: validated };
  } catch (error) {
    console.error("Search error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error en la búsqueda",
    };
  }
}
