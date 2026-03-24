import { NextRequest, NextResponse } from "next/server";
import { listAlerts } from "@/features/alerts-storage/services/storage-alerts.service";
import { AlertsStorageListSchema } from "@/features/alerts-storage/schemas/alerts-storage.schema";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
    const estatus = searchParams.get("estatus") || undefined;
    const nacionalidad = searchParams.get("nacionalidad") || undefined;
    const tipoAlerta = searchParams.get("tipoAlerta") || undefined;

    const validated = AlertsStorageListSchema.parse({
      page,
      pageSize,
      filters: { estatus, nacionalidad, tipoAlerta },
    });

    const result = await listAlerts(validated);

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Storage route error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
