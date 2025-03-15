"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RevenueSource, TransactionStatus } from "@/lib/monetization-service"
import { formatCurrency, formatDate } from "@/lib/utils"
import { SearchIcon, FilterIcon } from "lucide-react"

interface TransactionHistoryProps {
  artistId: string
}

interface Transaction {
  id: string
  amount: number
  description: string
  source: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

export function TransactionHistory({ artistId }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions?artistId=${artistId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }

        const data = await response.json()
        setTransactions(data)
      } catch (error: any) {
        setError(error.message || "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [artistId])

  // Filtrar transações
  const filteredTransactions = transactions.filter((transaction) => {
    // Filtrar por termo de busca
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtrar por status
    const matchesFilter =
      filter === "all" ||
      transaction.status.toLowerCase() === filter.toLowerCase() ||
      transaction.source.toLowerCase() === filter.toLowerCase()

    return matchesSearch && matchesFilter
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-white/10 h-6 w-1/3 rounded"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-white/10 h-60 rounded"></div>
        </CardContent>
      </Card>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Transações</CardTitle>
        <CardDescription>Todas as transações relacionadas à sua conta de artista</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <FilterIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="failed">Falhas</SelectItem>
                <SelectItem value="event_ticket">Ingressos</SelectItem>
                <SelectItem value="merchandise">Merchandise</SelectItem>
                <SelectItem value="album_sale">Álbuns</SelectItem>
                <SelectItem value="track_sale">Faixas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Fã</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {transaction.user.name || transaction.user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getSourceLabel(transaction.source as RevenueSource)}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status as TransactionStatus} />
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(transaction.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const variants: Record<TransactionStatus, "default" | "success" | "destructive" | "outline"> = {
    [TransactionStatus.PENDING]: "default",
    [TransactionStatus.COMPLETED]: "success",
    [TransactionStatus.FAILED]: "destructive",
    [TransactionStatus.REFUNDED]: "outline",
  }

  const labels: Record<TransactionStatus, string> = {
    [TransactionStatus.PENDING]: "Pendente",
    [TransactionStatus.COMPLETED]: "Concluído",
    [TransactionStatus.FAILED]: "Falha",
    [TransactionStatus.REFUNDED]: "Reembolsado",
  }

  return <Badge variant={variants[status]}>{labels[status] || status}</Badge>
}

function getSourceLabel(source: RevenueSource): string {
  const labels: Record<RevenueSource, string> = {
    [RevenueSource.EVENT_TICKET]: "Ingresso",
    [RevenueSource.MERCHANDISE]: "Merchandise",
    [RevenueSource.ALBUM_SALE]: "Álbum",
    [RevenueSource.TRACK_SALE]: "Faixa",
    [RevenueSource.SUBSCRIPTION]: "Assinatura",
    [RevenueSource.DONATION]: "Doação",
    [RevenueSource.STREAMING]: "Streaming",
    [RevenueSource.EXCLUSIVE_CONTENT]: "Conteúdo Exclusivo",
  }

  return labels[source] || source
}

