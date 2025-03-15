import { prisma } from "@/lib/db"
import { TRANSACTION_TYPE } from "@prisma/client"

/**
 * Tipos de transações monetárias na plataforma
 */
export enum RevenueSource {
  EVENT_TICKET = "EVENT_TICKET",
  MERCHANDISE = "MERCHANDISE",
  ALBUM_SALE = "ALBUM_SALE",
  TRACK_SALE = "TRACK_SALE",
  SUBSCRIPTION = "SUBSCRIPTION",
  DONATION = "DONATION",
  STREAMING = "STREAMING",
  EXCLUSIVE_CONTENT = "EXCLUSIVE_CONTENT",
}

/**
 * Status de uma transação
 */
export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

/**
 * Interface para criação de uma transação
 */
export interface CreateTransactionInput {
  amount: number
  userId: string
  artistId?: string
  description: string
  source: RevenueSource
  sourceId?: string // ID do item relacionado (evento, merchandise, etc.)
  metadata?: Record<string, any>
}

/**
 * Interface para criação de um pagamento
 */
export interface CreatePaymentInput {
  transactionId: string
  paymentMethod: string
  paymentDetails: Record<string, any>
}

/**
 * Serviço de monetização para gerenciar transações financeiras
 */
export class MonetizationService {
  /**
   * Cria uma nova transação
   */
  static async createTransaction(input: CreateTransactionInput) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          amount: input.amount,
          userId: input.userId,
          artistId: input.artistId,
          description: input.description,
          type: TRANSACTION_TYPE.PURCHASE,
          source: input.source,
          sourceId: input.sourceId,
          status: TransactionStatus.PENDING,
          metadata: input.metadata || {},
        },
      })

      return transaction
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw new Error("Failed to create transaction")
    }
  }

  /**
   * Processa um pagamento para uma transação
   */
  static async processPayment(input: CreatePaymentInput) {
    try {
      // Buscar a transação
      const transaction = await prisma.transaction.findUnique({
        where: { id: input.transactionId },
      })

      if (!transaction) {
        throw new Error("Transaction not found")
      }

      if (transaction.status !== TransactionStatus.PENDING) {
        throw new Error(`Transaction is already ${transaction.status}`)
      }

      // Simular processamento de pagamento
      // Em produção, aqui seria integrado com um gateway de pagamento real
      const paymentSuccessful = Math.random() > 0.1 // 90% de chance de sucesso para simulação

      if (!paymentSuccessful) {
        await prisma.transaction.update({
          where: { id: input.transactionId },
          data: { status: TransactionStatus.FAILED },
        })
        throw new Error("Payment processing failed")
      }

      // Atualizar status da transação
      const updatedTransaction = await prisma.transaction.update({
        where: { id: input.transactionId },
        data: {
          status: TransactionStatus.COMPLETED,
          payment: {
            create: {
              method: input.paymentMethod,
              details: input.paymentDetails,
              status: "COMPLETED",
            },
          },
        },
        include: {
          payment: true,
        },
      })

      // Se for uma compra de ingresso, criar o ingresso
      if (transaction.source === RevenueSource.EVENT_TICKET && transaction.sourceId) {
        await prisma.ticket.create({
          data: {
            eventId: transaction.sourceId,
            userId: transaction.userId,
            transactionId: transaction.id,
            status: "ACTIVE",
          },
        })
      }

      // Se for uma compra de merchandise, atualizar o estoque
      if (transaction.source === RevenueSource.MERCHANDISE && transaction.sourceId) {
        await prisma.merchandise.update({
          where: { id: transaction.sourceId },
          data: {
            stock: {
              decrement: 1,
            },
          },
        })
      }

      // Distribuir JestCoins como recompensa pela compra (5% do valor)
      const jestCoinsAmount = Math.floor(transaction.amount * 0.05)
      if (jestCoinsAmount > 0) {
        await prisma.jestCoin.create({
          data: {
            userId: transaction.userId,
            amount: jestCoinsAmount,
            description: `Recompensa por compra: ${transaction.description}`,
            transactionId: transaction.id,
          },
        })
      }

      return updatedTransaction
    } catch (error) {
      console.error("Error processing payment:", error)
      throw new Error(`Failed to process payment: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Obtém o histórico de transações de um artista
   */
  static async getArtistTransactions(artistId: string) {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          artistId,
          status: TransactionStatus.COMPLETED,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payment: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return transactions
    } catch (error) {
      console.error("Error fetching artist transactions:", error)
      throw new Error("Failed to fetch artist transactions")
    }
  }

  /**
   * Calcula o resumo de receita de um artista
   */
  static async getArtistRevenueSummary(artistId: string) {
    try {
      // Obter todas as transações concluídas
      const transactions = await prisma.transaction.findMany({
        where: {
          artistId,
          status: TransactionStatus.COMPLETED,
        },
      })

      // Calcular receita total
      const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0)

      // Calcular receita por fonte
      const revenueBySource = transactions.reduce(
        (acc, tx) => {
          const source = tx.source as string
          acc[source] = (acc[source] || 0) + tx.amount
          return acc
        },
        {} as Record<string, number>,
      )

      // Calcular receita por mês (últimos 6 meses)
      const today = new Date()
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(today.getMonth() - 6)

      const recentTransactions = transactions.filter((tx) => new Date(tx.createdAt) >= sixMonthsAgo)

      const revenueByMonth: Record<string, number> = {}

      // Inicializar os últimos 6 meses com zero
      for (let i = 0; i < 6; i++) {
        const date = new Date()
        date.setMonth(today.getMonth() - i)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        revenueByMonth[monthKey] = 0
      }

      // Preencher com dados reais
      recentTransactions.forEach((tx) => {
        const date = new Date(tx.createdAt)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + tx.amount
      })

      return {
        totalRevenue,
        revenueBySource,
        revenueByMonth,
        transactionCount: transactions.length,
      }
    } catch (error) {
      console.error("Error calculating artist revenue summary:", error)
      throw new Error("Failed to calculate artist revenue summary")
    }
  }

  /**
   * Obtém os principais fãs de um artista (por valor gasto)
   */
  static async getArtistTopFans(artistId: string, limit = 10) {
    try {
      // Agrupar transações por usuário e somar valores
      const fanSpending = await prisma.$queryRaw`
        SELECT 
          "userId", 
          SUM("amount") as "totalSpent",
          COUNT(*) as "transactionCount"
        FROM "Transaction"
        WHERE "artistId" = ${artistId}
          AND "status" = 'COMPLETED'
        GROUP BY "userId"
        ORDER BY "totalSpent" DESC
        LIMIT ${limit}
      `

      // Buscar detalhes dos usuários
      const fanIds = (fanSpending as any[]).map((fan) => fan.userId)

      const fans = await prisma.user.findMany({
        where: {
          id: {
            in: fanIds,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      })

      // Combinar dados
      const topFans = (fanSpending as any[]).map((spending) => {
        const fan = fans.find((f) => f.id === spending.userId)
        return {
          user: fan,
          totalSpent: Number(spending.totalSpent),
          transactionCount: Number(spending.transactionCount),
        }
      })

      return topFans
    } catch (error) {
      console.error("Error fetching artist top fans:", error)
      throw new Error("Failed to fetch artist top fans")
    }
  }
}

