"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DepositModal } from "@/components/DepositModal"
import { CreditCard } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function PaymentButton() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold"
                            size="sm"
                        >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Depositar / Adicionar Fundos
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Compre USDC com Cartão de Crédito ou PIX</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DepositModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}
