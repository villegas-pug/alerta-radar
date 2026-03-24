import { NextResponse } from "next/server"
import { getAnalyticsStats } from "@/features/alerts-analytics/services/get-analytics-stats.service"

export async function GET() {
  const result = await getAnalyticsStats()

  if (!result.ok) {
    return NextResponse.json(result, { status: 500 })
  }

  return NextResponse.json(result)
}
