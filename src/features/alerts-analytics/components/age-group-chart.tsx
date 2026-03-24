"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import type { AgeGroupData } from "../types/analytics.types"

interface AgeGroupChartProps {
  data: AgeGroupData[]
  className?: string
}

const AGE_COLORS: Record<string, string> = {
  "0-17": "#f472b6",
  "18-30": "#818cf8",
  "31-50": "#22c55e",
  "51-70": "#f97316",
  "70+": "#ef4444",
}

const AGE_LABELS: Record<string, string> = {
  "0-17": "Menores",
  "18-30": "Jóvenes",
  "31-50": "Adultos",
  "51-70": "Maduros",
  "70+": "Mayores",
}

export function AgeGroupChart({ data, className }: AgeGroupChartProps) {
  const orderedGroups = ["0-17", "18-30", "31-50", "51-70", "70+"]
  const orderedData = orderedGroups.map((g) => {
    const found = data.find((d) => d.grupo === g)
    return { grupo: g, count: found?.count ?? 0 }
  })

  const total = orderedData.reduce((sum, d) => sum + d.count, 0)
  const dominantGroup = orderedData.reduce((max, d) => (d.count > max.count ? d : max), orderedData[0])

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold">Grupos Etarios</CardTitle>
            <CardDescription className="hidden sm:block">Distribución por edad</CardDescription>
          </div>
          {total > 0 && (
            <div className="text-right">
              <p className="text-sm font-semibold" style={{ color: AGE_COLORS[dominantGroup.grupo] }}>
                {AGE_LABELS[dominantGroup.grupo]}
              </p>
              <p className="text-xs text-muted-foreground">grupo principal</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[200px] sm:h-[220px] md:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderedData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="grupo"
                tickFormatter={(v) => AGE_LABELS[v] || v}
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tickFormatter={(v) => v.toLocaleString()}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
                    return (
                      <div className="bg-card border border-border rounded-lg p-2 shadow-lg text-sm">
                        <p className="font-semibold mb-1">{AGE_LABELS[item.grupo]}</p>
                        <p className="text-xl font-bold" style={{ color: AGE_COLORS[item.grupo] }}>
                          {item.count.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {total > 0 ? ((item.count / total) * 100).toFixed(1) : 0}% del total
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {orderedData.map((entry) => (
                  <Bar
                    key={entry.grupo}
                    dataKey="count"
                    fill={AGE_COLORS[entry.grupo]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
