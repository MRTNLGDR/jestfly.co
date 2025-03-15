"use client"

import { useEffect, useRef, useState } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart as RechartsLineChart,
  Line,
} from "recharts"

interface ChartProps {
  data: Array<Record<string, any>>
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  showLegend?: boolean
  showGridLines?: boolean
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["#6366f1", "#8b5cf6", "#ec4899"],
  valueFormatter = (value: number) => value.toString(),
  showLegend = true,
  showGridLines = true,
}: ChartProps) {
  const [chartWidth, setChartWidth] = useState(0)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateWidth = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.clientWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  return (
    <div ref={chartRef} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 40,
          }}
        >
          {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />}
          <XAxis
            dataKey={index}
            tick={{ fill: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            tick={{ fill: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={false}
            tickFormatter={valueFormatter}
          />
          <Tooltip
            formatter={(value: number) => [valueFormatter(value), ""]}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              color: "white",
            }}
          />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)" }} />}
          {categories.map((category, index) => (
            <Bar key={category} dataKey={category} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["#6366f1", "#8b5cf6", "#ec4899"],
  valueFormatter = (value: number) => value.toString(),
  showLegend = true,
  showGridLines = true,
}: ChartProps) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 40,
          }}
        >
          {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />}
          <XAxis
            dataKey={index}
            tick={{ fill: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            tick={{ fill: "rgba(255, 255, 255, 0.7)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickLine={false}
            tickFormatter={valueFormatter}
          />
          <Tooltip
            formatter={(value: number) => [valueFormatter(value), ""]}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              color: "white",
            }}
          />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: "rgba(255, 255, 255, 0.7)" }} />}
          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

