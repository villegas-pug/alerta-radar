"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import type { GenderData } from "../types/analytics.types"
import type { PieLabelRenderProps } from "recharts"

interface GenderChartProps {
  data: GenderData[]
  className?: string
}

const GENDER_COLORS = [
  { color: "#6366f1", label: "Indigo" },
  { color: "#ec4899", label: "Rosa" },
  { color: "#6b7280", label: "Gris" },
  { color: "#f97316", label: "Naranja" },
]

export function GenderChart({ data, className }: GenderChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  const maxItem = data.reduce((max, d) => (d.count > max.count ? d : max), data[0])

  const renderLabel = (props: PieLabelRenderProps) => {
    const percent = (props.percent || 0) * 100
    if (percent < 8) return null
    return `${percent.toFixed(0)}%`
  }

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-lg", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold">Distribución por Género</CardTitle>
            <CardDescription className="hidden sm:block">Composición demográfica</CardDescription>
          </div>
          {maxItem && (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: GENDER_COLORS[0].color }}
              />
              <span className="text-sm font-medium">{maxItem.genero}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[200px] sm:h-[220px] md:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="genero"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                label={renderLabel}
                labelLine={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GENDER_COLORS[index % GENDER_COLORS.length].color}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
                    return (
                      <div className="bg-card border border-border rounded-lg p-2 shadow-lg text-sm">
                        <p className="font-semibold mb-1">{item.genero}</p>
                        <p className="text-xl font-bold text-primary">
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
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                <tspan x="50%" dy="-0.5em" className="text-lg font-bold fill-foreground">
                  {total.toLocaleString()}
                </tspan>
                <tspan x="50%" dy="1.2em" className="text-[10px] fill-muted-foreground">
                  total
                </tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-2 sm:mt-4">
          {data.map((item, index) => (
            <div key={item.genero} className="flex items-center gap-1 sm:gap-2">
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: GENDER_COLORS[index % GENDER_COLORS.length].color }}
              />
              <span className="text-xs text-muted-foreground">{item.genero}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
