import { NextRequest, NextResponse } from "next/server";
import { searchAlerts } from "@/features/alerts-search/services/search-alerts.service";
import { AlertsSearchSchema } from "@/features/alerts-search/schemas/alerts-search.schema";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    const validated = AlertsSearchSchema.parse({ query, page });
    const result = await searchAlerts(validated);

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Search route error:", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
