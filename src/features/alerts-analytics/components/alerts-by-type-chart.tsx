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
  Cell,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import type { AlertByType } from "../types/analytics.types"

interface AlertsByTypeChartProps {
  data: AlertByType[]
  className?: string
}

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
]

export function AlertsByTypeChart({ data, className }: AlertsByTypeChartProps) {
  const chartData = data.map((item) => ({
    tipo: item.tipo.length > 15 ? item.tipo.slice(0, 15) + "..." : item.tipo,
    count: item.count,
    tipoOriginal: item.tipo,
  }))

  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold">
              Distribución por Tipo
            </CardTitle>
            <CardDescription className="hidden sm:block">
              {data.length} tipos de alerta · {total.toLocaleString()} registros
            </CardDescription>
          </div>
          <div className="flex gap-1 sm:gap-2">
            {data.slice(0, 3).map((item, i) => (
              <div
                key={item.tipo}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-full text-xs"
                style={{ backgroundColor: `${CHART_COLORS[i]}20` }}
              >
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[i] }}
                />
                <span className="font-medium text-xs">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[200px] sm:h-[220px] md:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis
                type="number"
                tickFormatter={(v) => v.toLocaleString()}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                type="category"
                dataKey="tipo"
                width={80}
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
                        <p className="font-semibold mb-1">{item.tipoOriginal}</p>
                        <p className="text-xl font-bold text-primary">
                          {item.count.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((item.count / total) * 100).toFixed(1)}% del total
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
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
