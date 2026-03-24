"use client"

import { KpiCards } from "./kpi-cards"
import { AlertsByTypeChart } from "./alerts-by-type-chart"
import { NationalityChart } from "./nationality-chart"
import { AgeGroupChart } from "./age-group-chart"
import { GenderChart } from "./gender-chart"
import { TimelineChart } from "./timeline-chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "@/components/ui/chart"
import { Building2 } from "lucide-react"
import type { AnalyticsStats } from "../types/analytics.types"

interface AnalyticsDashboardProps {
  data: AnalyticsStats | null
  loading: boolean
}

export function AnalyticsDashboard({ data, loading }: AnalyticsDashboardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 sm:h-32 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="col-span-1 md:col-span-6 lg:col-span-4 h-72 sm:h-80 md:h-96 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="mb-2">Sin datos disponibles</CardTitle>
          <CardDescription>
            No se pudieron cargar los datos de analytics. Intenta más tarde.
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
      <KpiCards
        data={data.kpis}
        loading={false}
        className="col-span-1 md:col-span-2 lg:col-span-12"
      />

      <TimelineChart
        data={data.timeline}
        className="col-span-1 md:col-span-8 lg:col-span-8"
      />

      <NationalityChart
        data={data.topNationalities}
        className="col-span-1 md:col-span-4 lg:col-span-4"
      />

      <AlertsByTypeChart
        data={data.alertsByType}
        className="col-span-1 md:col-span-12 lg:col-span-12"
      />

      <AgeGroupChart
        data={data.ageGroups}
        className="col-span-1 md:col-span-6 lg:col-span-6"
      />

      <GenderChart
        data={data.genderDistribution}
        className="col-span-1 md:col-span-6 lg:col-span-6"
      />

      {data.byAuthority.length > 0 && (
        <Card className="col-span-1 md:col-span-12 lg:col-span-12 transition-all duration-200 hover:shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                  Autoridades Emisoras
                </CardTitle>
                <CardDescription className="hidden sm:block">Principales entidades que emitieron alertas</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-orange-600">{data.byAuthority.length}</p>
                <p className="text-xs text-muted-foreground">autoridades</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[200px] sm:h-[220px] md:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byAuthority} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="authorityGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                  <XAxis
                    type="number"
                    tickFormatter={(v) => v.toLocaleString()}
                    tick={{ fontSize: 10, width: 40 }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="autoridad"
                    width={60}
                    tick={{ fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#authorityGradient)"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
