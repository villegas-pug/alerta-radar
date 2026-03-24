"use client"

import { useEffect, useState } from "react"
import { BarChart3 } from "lucide-react"
import { AnalyticsDashboard } from "@/features/alerts-analytics"
import type { AnalyticsStats } from "@/features/alerts-analytics"
import { PageHeader } from "@/components/layout"

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics")
        const result = await res.json()
        if (result.ok) {
          setData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  return (
    <>
      <PageHeader
        icon={BarChart3}
        title="Analítica"
        description="Estadísticas y análisis de alertas migratorias"
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <AnalyticsDashboard data={data} loading={loading} />
      </div>
    </>
  )
}
