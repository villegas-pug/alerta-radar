import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { cn } from "@/lib/utils"

interface ChartConfig {
  [key: string]: {
    label?: string
    color?: string
  }
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: ChartConfig
    children: React.ReactNode
  }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("w-full", className)} {...props}>
    {children}
  </div>
))
ChartContainer.displayName = "ChartContainer"

const ChartStyle = ({ id, config }: { id?: string; config?: ChartConfig }) => {
  if (!config) return null
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(config)
          .map(
            ([key, value]) =>
              `--color-${key}: ${value.color || "#000"};`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltipContent = ({
  active,
  payload,
  className,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  className?: string
}) => {
  if (!active || !payload?.length) return null

  return (
    <div className={cn("rounded-lg border bg-background p-2 shadow-sm", className)}>
      <div className="grid gap-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">
              {entry.name}:
            </span>
            <span className="text-xs font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ChartTooltip = Tooltip

interface ChartProps {
  children: React.ReactNode
}

const Chart = ({ children }: ChartProps) => {
  return <>{children}</>
}

export {
  Chart,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  TrendingUp,
  TrendingDown,
}

export type { ChartConfig }
