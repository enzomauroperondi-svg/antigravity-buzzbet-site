"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, Sparkles, Wallet, Trophy, LayoutDashboard } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useWeb3 } from "@/lib/web3-context"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PaymentButton } from "@/components/PaymentButton"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { account, balance, isConnecting, connectWallet, disconnectWallet } = useWeb3()

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <Link href="/" className="text-xl font-bold">
            Buzzbet
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="/#markets"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Markets
          </a>
          {account && (
            <>
              <Link
                href="/portfolio"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <LayoutDashboard className="h-4 w-4" />
                Portfolio
              </Link>
              <Link
                href="/winnings"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Trophy className="h-4 w-4" />
                Winnings
              </Link>
            </>
          )}
          <a
            href="/#leaderboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Leaderboard
          </a>
          <a
            href="/#about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <PaymentButton />
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          {!account ? (
            <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={connectWallet} disabled={isConnecting}>
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Wallet className="h-4 w-4 mr-2" />
                  {formatAddress(account)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Balance</span>
                    <span className="font-semibold">
                      {balance ? `${Number.parseFloat(balance).toFixed(4)} ETH` : "Loading..."}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/winnings" className="cursor-pointer">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Winnings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnectWallet}>Disconnect</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
