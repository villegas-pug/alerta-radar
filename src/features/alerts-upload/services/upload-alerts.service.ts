import { prisma } from "@/lib/prisma/client";
import { elasticClient, ALERTS_INDEX } from "@/lib/elasticsearch/client";
import { ActionResult } from "@/types/action-result";
import * as XLSX from "xlsx";

interface ParsedAlert {
  nombre: string;
  pasaporte: string;
  nacionalidad: string;
  tipoAlerta: string;
  descripcion: string;
  fechaNacimiento?: string;
  lugarNacimiento?: string;
  genero?: string;
  fechaAlerta?: string;
  autoridadEmisora?: string;
}

interface UploadResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{ row: number; message: string }>;
}

function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

function toString(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function mapRowToAlert(row: ParsedAlert, fileName: string) {
  return {
    nombre: toString(row.nombre),
    pasaporte: toString(row.pasaporte),
    nacionalidad: toString(row.nacionalidad),
    tipoAlerta: toString(row.tipoAlerta),
    descripcion: toString(row.descripcion),
    fechaNacimiento: parseDate(toString(row.fechaNacimiento) || undefined),
    lugarNacimiento: toString(row.lugarNacimiento) || null,
    genero: toString(row.genero) || null,
    fechaAlerta: parseDate(toString(row.fechaAlerta) || undefined) || new Date(),
    autoridadEmisora: toString(row.autoridadEmisora) || null,
    archivoOrigen: fileName,
  };
}

function normalizeHeaders(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  headers.forEach((header) => {
    const normalized = header.toLowerCase().replace(/[\s-]/g, "_").trim();
    mapping[normalized] = header;
  });
  return mapping;
}

function createHeaderIndexMap(headers: string[]): Record<string, number> {
  const indexMap: Record<string, number> = {};
  headers.forEach((header, index) => {
    const normalized = header.toLowerCase().replace(/[\s-]/g, "_").trim();
    indexMap[normalized] = index;
  });
  return indexMap;
}

export async function uploadAlertsFromFile(
  buffer: Buffer,
  fileName: string
): Promise<ActionResult<UploadResult>> {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<ParsedAlert>(worksheet, {
      header: 1,
    });

    if (jsonData.length < 2) {
      return {
        ok: false,
        error: "El archivo no contiene suficientes datos",
      };
    }

    const headers = jsonData[0] as unknown as string[];
    const headerIndexMap = createHeaderIndexMap(headers);
    const dataRows = jsonData.slice(1);

    const result: UploadResult = {
      totalRows: dataRows.length,
      successCount: 0,
      errorCount: 0,
      errors: [],
    };

    const alertsToInsert: Array<{
      nombre: string;
      pasaporte: string;
      nacionalidad: string;
      tipoAlerta: string;
      descripcion: string;
      fechaNacimiento: Date | null;
      lugarNacimiento: string | null;
      genero: string | null;
      fechaAlerta: Date;
      autoridadEmisora: string | null;
      archivoOrigen: string;
    }> = [];

    const alertsForElastic: Array<{
      id: string;
      nombre: string;
      pasaporte: string;
      nacionalidad: string;
      tipoAlerta: string;
      descripcion: string;
      fechaAlerta: Date;
      fechaCreacion: Date;
      estatus: string;
    }> = [];

    dataRows.forEach((row: unknown, index: number) => {
      const rowArray = row as unknown[];
      const mappedRow: ParsedAlert = {
        nombre: toString(rowArray[headerIndexMap["nombre"]]),
        pasaporte: toString(rowArray[headerIndexMap["pasaporte"]]),
        nacionalidad: toString(rowArray[headerIndexMap["nacionalidad"]]),
        tipoAlerta: toString(rowArray[headerIndexMap["tipoalerta"]]),
        descripcion: toString(rowArray[headerIndexMap["descripcion"]]),
        fechaNacimiento: toString(rowArray[headerIndexMap["fechanacimiento"]]) || undefined,
        lugarNacimiento: toString(rowArray[headerIndexMap["lugarnacimiento"]]) || undefined,
        genero: toString(rowArray[headerIndexMap["genero"]]) || undefined,
        fechaAlerta: toString(rowArray[headerIndexMap["fechaalerta"]]) || undefined,
        autoridadEmisora: toString(rowArray[headerIndexMap["autoridademisora"]]) || undefined,
      };

      if (!mappedRow.nombre || !mappedRow.pasaporte) {
        result.errorCount++;
        result.errors.push({
          row: index + 2,
          message: "Faltan campos requeridos (nombre o pasaporte)",
        });
        return;
      }

      const alertData = mapRowToAlert(mappedRow, fileName);
      alertsToInsert.push(alertData);
    });

    if (alertsToInsert.length > 0) {
      const insertedAlerts = await prisma.alertaMigratoria.createManyAndReturn({
        data: alertsToInsert,
      });

      for (const alert of insertedAlerts) {
        alertsForElastic.push({
          id: alert.id,
          nombre: alert.nombre,
          pasaporte: alert.pasaporte,
          nacionalidad: alert.nacionalidad,
          tipoAlerta: alert.tipoAlerta,
          descripcion: alert.descripcion,
          fechaAlerta: alert.fechaAlerta,
          fechaCreacion: alert.fechaCreacion,
          estatus: alert.estatus,
        });
      }

      try {
        const bulkBody = alertsForElastic.flatMap((doc) => [
          { index: { _index: ALERTS_INDEX, _id: doc.id } },
          doc,
        ]);

        await elasticClient.bulk({
          operations: bulkBody,
          refresh: true,
        });
      } catch (elasticError) {
        console.error("Error indexing to Elasticsearch:", elasticError);
      }

      result.successCount = insertedAlerts.length;
    }

    return { ok: true, data: result };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al procesar el archivo",
    };
  }
}
