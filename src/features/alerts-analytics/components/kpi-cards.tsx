"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertCircle, Upload, Search, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { KpiStats } from "../types/analytics.types"

interface KpiCardsProps {
  data: KpiStats | null
  loading: boolean
  className?: string
}

const KPI_CONFIG = [
  {
    title: "Total de Alertas",
    key: "totalAlerts" as const,
    icon: Shield,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    description: "Registros en el sistema",
  },
  {
    title: "Alertas Activas",
    key: "activeAlerts" as const,
    icon: AlertCircle,
    color: "green",
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    description: "Alertas vigentes",
  },
  {
    title: "Cargas",
    key: "uploadsCount" as const,
    icon: Upload,
    color: "purple",
    gradient: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-50",
    description: "Archivos importados",
  },
  {
    title: "Búsquedas",
    key: "searchesCount" as const,
    icon: Search,
    color: "orange",
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-orange-50",
    description: "Consultas realizadas",
  },
]

export function KpiCards({ data, loading, className }: KpiCardsProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6", className)}>
      {KPI_CONFIG.map((kpi) => (
        <Card
          key={kpi.title}
          className="relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div
            className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full ${kpi.bgLight} -mr-6 sm:-mr-8 -mt-6 sm:-mt-8 opacity-60`}
          />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative p-3 sm:p-4">
            <div className="flex flex-col gap-1 min-w-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {kpi.title}
              </CardTitle>
              <div className={`w-8 sm:w-10 h-0.5 rounded-full bg-gradient-to-r ${kpi.gradient}`} />
            </div>
            <div
              className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-sm shrink-0`}
            >
              <kpi.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight tabular-nums">
              {loading ? (
                <span className="inline-block w-12 sm:w-16 h-5 sm:h-7 bg-muted animate-pulse rounded" />
              ) : (
                (data?.[kpi.key] ?? 0).toLocaleString()
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">{kpi.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
