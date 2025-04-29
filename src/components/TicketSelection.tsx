"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"

interface Ticket {
  id: string
  name: string
  price: number
  description: string
  availableSeats: number
}

interface TicketSelectionProps {
  tickets: Ticket[]
}

export function TicketSelection({ tickets }: TicketSelectionProps) {
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({})

  const totalAmount = Object.entries(selectedTickets).reduce((total, [id, quantity]) => {
    const ticket = tickets.find((t) => t.id === id)
    return total + (ticket?.price || 0) * quantity
  }, 0)

  const totalTickets = Object.values(selectedTickets).reduce((sum, quantity) => sum + quantity, 0)

  const handleIncrement = (id: string) => {
    const ticket = tickets.find((t) => t.id === id)
    const currentQuantity = selectedTickets[id] || 0

    if (ticket && currentQuantity < ticket.availableSeats) {
      setSelectedTickets({
        ...selectedTickets,
        [id]: currentQuantity + 1,
      })
    }
  }

  const handleDecrement = (id: string) => {
    const currentQuantity = selectedTickets[id] || 0

    if (currentQuantity > 0) {
      setSelectedTickets({
        ...selectedTickets,
        [id]: currentQuantity - 1,
      })
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Select Tickets</h3>

      <div className="space-y-2">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
            <div className="space-y-1">
              <p className="font-medium">{ticket.name}</p>
              <p className="text-sm text-muted-foreground">{ticket.description}</p>
              <p className="text-sm font-medium">{formatCurrency(ticket.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDecrement(ticket.id)}
                disabled={(selectedTickets[ticket.id] || 0) === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center">{selectedTickets[ticket.id] || 0}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleIncrement(ticket.id)}
                disabled={(selectedTickets[ticket.id] || 0) >= ticket.availableSeats}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {totalTickets > 0 && (
        <>
          <Separator />
          <div className="flex items-center justify-between font-medium">
            <span>Total ({totalTickets} tickets)</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </>
      )}
    </div>
  )
}
