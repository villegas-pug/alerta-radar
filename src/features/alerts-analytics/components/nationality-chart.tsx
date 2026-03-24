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
import type { NationalityData } from "../types/analytics.types"

interface NationalityChartProps {
  data: NationalityData[]
  className?: string
}

export function NationalityChart({ data, className }: NationalityChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  const topNationality = data[0]

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold">Nacionalidades</CardTitle>
            <CardDescription className="hidden sm:block">Top 10 por cantidad de alertas</CardDescription>
          </div>
          {topNationality && (
            <div className="text-right">
              <p className="text-lg sm:text-xl font-bold text-cyan-600">{topNationality.count.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[100px]">{topNationality.nacionalidad}</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[200px] sm:h-[220px] md:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="nationalityGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <XAxis
                type="number"
                tickFormatter={(v) => v.toLocaleString()}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                type="category"
                dataKey="nacionalidad"
                width={60}
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
                    return (
                      <div className="bg-card border border-border rounded-lg p-2 shadow-lg text-sm">
                        <p className="font-semibold mb-1">{item.nacionalidad}</p>
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
              <Bar
                dataKey="count"
                fill="url(#nationalityGradient)"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
