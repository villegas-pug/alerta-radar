"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import type { TimelineData } from "../types/analytics.types"

interface TimelineChartProps {
  data: TimelineData[]
  className?: string
}

export function TimelineChart({ data, className }: TimelineChartProps) {
  const totalAlerts = data.reduce((sum, d) => sum + d.count, 0)
  const avgPerMonth = data.length ? Math.round(totalAlerts / data.length) : 0

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold">
              Tendencia de Alertas
            </CardTitle>
            <CardDescription className="hidden sm:block">
              Año actual · Total: {totalAlerts.toLocaleString()} alertas
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{avgPerMonth}</p>
            <p className="text-xs text-muted-foreground">promedio/mes</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[200px] sm:h-[220px] md:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tickFormatter={(v) => v.toLocaleString()}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <ChartTooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                  padding: "8px",
                }}
                labelStyle={{ fontWeight: 600, marginBottom: "2px" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{
                  fill: "#3b82f6",
                  strokeWidth: 2,
                  r: 3,
                  stroke: "hsl(var(--card))",
                }}
                activeDot={{
                  r: 5,
                  fill: "#3b82f6",
                  stroke: "hsl(var(--card))",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
