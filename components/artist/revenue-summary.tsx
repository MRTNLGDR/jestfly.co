"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DollarSignIcon, TrendingUpIcon, UsersIcon, ShoppingCartIcon } from "lucide-react"
import { RevenueSource } from "@/lib/monetization-service"
import { formatCurrency } from "@/lib/utils"
import { BarChart, LineChart } from "@/components/ui/charts"

interface RevenueSummaryProps {
  artistId: string
}

interface RevenueSummary {
  totalRevenue: number
  revenueBySource: Record<string, number>
  revenueByMonth: Record<string, number>
  transactionCount: number
  topFans: Array<{
    user: {
      id: string
      name: string
      email: string
      image: string | null
    }
    totalSpent: number
    transactionCount: number
  }>
}

export function RevenueSummary({ artistId }: RevenueSummaryProps) {
  const [data, setData] = useState<RevenueSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/artists/${artistId}/revenue`)

        if (!response.ok) {
          throw new Error("Failed to fetch revenue data")
        }

        const data = await response.json()
        setData(data)
      } catch (error: any) {
        setError(error.message || "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [artistId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="animate-pulse bg-white/10 h-6 w-1/3 rounded"></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse bg-white/10 h-40 rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sem dados</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nenhum dado de receita disponível.</p>
        </CardContent>
      </Card>
    )
  }

  // Preparar dados para gráficos
  const monthlyRevenueData = Object.entries(data.revenueByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => {
      const [year, monthNum] = month.split("-")
      const date = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1)
      return {
        name: date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
        value,
      }
    })

  const sourceRevenueData = Object.entries(data.revenueBySource).map(([source, value]) => {
    const sourceLabel = getSourceLabel(source as RevenueSource)
    return {
      name: sourceLabel,
      value,
    }
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Receita Total</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <DollarSignIcon className="mr-2 h-5 w-5 text-iridescent-1" />
              {formatCurrency(data.totalRevenue)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transações</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <ShoppingCartIcon className="mr-2 h-5 w-5 text-iridescent-2" />
              {data.transactionCount}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ticket Médio</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <TrendingUpIcon className="mr-2 h-5 w-5 text-iridescent-3" />
              {formatCurrency(data.transactionCount > 0 ? data.totalRevenue / data.transactionCount : 0)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Top Fãs</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <UsersIcon className="mr-2 h-5 w-5 text-iridescent-1" />
              {data.topFans.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="monthly">
        <TabsList className="mb-4">
          <TabsTrigger value="monthly">Receita Mensal</TabsTrigger>
          <TabsTrigger value="sources">Por Fonte</TabsTrigger>
          <TabsTrigger value="fans">Top Fãs</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
              <CardDescription>Receita dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart
                  data={monthlyRevenueData}
                  index="name"
                  categories={["value"]}
                  colors={["#6366f1"]}
                  valueFormatter={(value) => formatCurrency(value)}
                  showLegend={false}
                  showGridLines={false}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Receita por Fonte</CardTitle>
              <CardDescription>Distribuição de receita por tipo de produto/serviço</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart
                  data={sourceRevenueData}
                  index="name"
                  categories={["value"]}
                  colors={["#6366f1"]}
                  valueFormatter={(value) => formatCurrency(value)}
                  showLegend={false}
                  showGridLines={false}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fans">
          <Card>
            <CardHeader>
              <CardTitle>Top Fãs</CardTitle>
              <CardDescription>Fãs que mais contribuíram financeiramente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topFans.map((fan) => (
                  <div
                    key={fan.user.id}
                    className="flex items-center justify-between p-4 border border-white/10 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={fan.user.image || undefined} />
                        <AvatarFallback>{fan.user.name?.charAt(0) || fan.user.email?.charAt(0) || "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{fan.user.name}</p>
                        <p className="text-sm text-muted-foreground">{fan.transactionCount} transações</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(fan.totalSpent)}</p>
                    </div>
                  </div>
                ))}

                {data.topFans.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Nenhum dado de fãs disponível ainda.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getSourceLabel(source: RevenueSource): string {
  const labels: Record<RevenueSource, string> = {
    [RevenueSource.EVENT_TICKET]: "Ingressos",
    [RevenueSource.MERCHANDISE]: "Merchandise",
    [RevenueSource.ALBUM_SALE]: "Álbuns",
    [RevenueSource.TRACK_SALE]: "Faixas",
    [RevenueSource.SUBSCRIPTION]: "Assinaturas",
    [RevenueSource.DONATION]: "Doações",
    [RevenueSource.STREAMING]: "Streaming",
    [RevenueSource.EXCLUSIVE_CONTENT]: "Conteúdo Exclusivo",
  }

  return labels[source] || source
}

