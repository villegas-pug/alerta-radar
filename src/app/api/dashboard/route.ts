import { NextResponse } from "next/server";
import { getDashboardStats } from "@/features/dashboard/services/get-dashboard-stats.service";

export async function GET() {
  const result = await getDashboardStats();

  if (!result.ok) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
