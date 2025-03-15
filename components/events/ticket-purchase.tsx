"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/auth-context"
import { useNotification } from "@/contexts/notification-context"
import { RevenueSource } from "@/lib/monetization-service"
import { formatCurrency } from "@/lib/utils"
import { TicketIcon, CreditCardIcon, WalletIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface TicketPurchaseProps {
  eventId: string
  eventTitle: string
  artistId: string
  artistName: string
  price: number
  availableTickets: number
}

export function TicketPurchase({
  eventId,
  eventTitle,
  artistId,
  artistName,
  price,
  availableTickets,
}: TicketPurchaseProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

  const { user, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const router = useRouter()

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      showNotification({
        title: "Erro",
        message: "Você precisa estar logado para comprar ingressos",
        type: "error",
      })
      router.push(`/login?redirect=/events/${eventId}`)
      return
    }

    if (availableTickets <= 0) {
      showNotification({
        title: "Erro",
        message: "Não há mais ingressos disponíveis para este evento",
        type: "error",
      })
      return
    }

    setIsDialogOpen(true)
  }

  const handlePayment = async () => {
    if (paymentMethod === "credit_card") {
      // Validação básica do cartão
      if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
        showNotification({
          title: "Erro",
          message: "Preencha todos os campos do cartão",
          type: "error",
        })
        return
      }
    }

    setIsProcessing(true)

    try {
      // 1. Criar transação
      const transactionResponse = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: price,
          artistId,
          description: `Ingresso para ${eventTitle}`,
          source: RevenueSource.EVENT_TICKET,
          sourceId: eventId,
          metadata: {
            eventTitle,
            artistName,
          },
        }),
      })

      if (!transactionResponse.ok) {
        const error = await transactionResponse.json()
        throw new Error(error.error || "Falha ao criar transação")
      }

      const transaction = await transactionResponse.json()

      // 2. Processar pagamento
      const paymentResponse = await fetch("/api/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: transaction.id,
          paymentMethod,
          paymentDetails:
            paymentMethod === "credit_card"
              ? {
                  cardNumber: cardNumber.replace(/\s/g, "").slice(-4), // Apenas os últimos 4 dígitos
                  cardName,
                  cardExpiry,
                }
              : {},
        }),
      })

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json()
        throw new Error(error.error || "Falha ao processar pagamento")
      }

      // 3. Sucesso
      showNotification({
        title: "Sucesso",
        message: "Ingresso comprado com sucesso!",
        type: "success",
      })

      // Fechar diálogo e redirecionar para página de ingressos
      setIsDialogOpen(false)
      router.push("/profile/tickets")
      router.refresh() // Atualizar dados da página
    } catch (error: any) {
      showNotification({
        title: "Erro",
        message: error.message || "Falha ao comprar ingresso",
        type: "error",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Formatar número do cartão
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Formatar data de expiração
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TicketIcon className="h-5 w-5 mr-2 text-iridescent-1" />
            Comprar Ingresso
          </CardTitle>
          <CardDescription>Garanta sua presença neste evento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Preço do ingresso</span>
              <span className="font-bold">{formatCurrency(price)}</span>
            </div>
            <div className="flex justify-between">
              <span>Disponibilidade</span>
              <span className={availableTickets > 0 ? "text-green-500" : "text-red-500"}>
                {availableTickets > 0 ? `${availableTickets} ingressos disponíveis` : "Esgotado"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
            onClick={handlePurchase}
            disabled={availableTickets <= 0}
          >
            {availableTickets > 0 ? "Comprar Ingresso" : "Esgotado"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Comprar Ingresso</DialogTitle>
            <DialogDescription>Complete o pagamento para garantir seu ingresso para {eventTitle}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Método de Pagamento</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center">
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Cartão de Crédito
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jestcoins" id="jestcoins" />
                  <Label htmlFor="jestcoins" className="flex items-center">
                    <WalletIcon className="h-4 w-4 mr-2" />
                    JestCoins
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "credit_card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <Input
                    id="cardName"
                    placeholder="NOME COMPLETO"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Validade</Label>
                    <Input
                      id="cardExpiry"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      id="cardCvc"
                      placeholder="000"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ""))}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "jestcoins" && (
              <div className="p-4 border border-white/20 rounded-md">
                <p className="text-sm">Você usará {price} JestCoins para esta compra.</p>
              </div>
            )}

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(price)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-gradient-to-r from-iridescent-1 to-iridescent-2 hover:opacity-90 transition-opacity"
            >
              {isProcessing ? "Processando..." : "Finalizar Compra"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

