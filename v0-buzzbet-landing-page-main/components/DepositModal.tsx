"use client"

import { MoonPayBuyWidget } from "@moonpay/moonpay-react"
import { useWeb3 } from "@/lib/web3-context"

interface DepositModalProps {
    isOpen: boolean
    onClose: () => void
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const { account, refreshBalance } = useWeb3()

    if (!isOpen) return null

    return (
        <MoonPayBuyWidget
            variant="overlay"
            baseCurrencyCode="usd"
            defaultCurrencyCode="usdc"
            currencyCode="usdc"
            walletAddress={account || ""}
            colorCode="#8B5CF6"
            visible={isOpen}
            onCloseOverlay={onClose}
            onTransactionCompleted={async () => {
                console.log("MoonPay transaction completed")
                await refreshBalance()
            }}
            apiKey={process.env.NEXT_PUBLIC_MOONPAY_API_KEY || ""}
        />
    )
}
