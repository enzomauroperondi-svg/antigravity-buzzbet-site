"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"

interface Web3ContextType {
  account: string | null
  balance: string | null
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  placeBet: (marketId: number, amount: string, prediction: "yes" | "no") => Promise<void>
  refreshBalance: () => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Check if wallet is already connected
    checkIfWalletIsConnected()

    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", () => window.location.reload())
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  useEffect(() => {
    if (account) {
      updateBalance(account)
      // Refresh balance every 10 seconds
      const interval = setInterval(() => updateBalance(account), 10000)
      return () => clearInterval(interval)
    }
  }, [account])

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          await updateBalance(accounts[0])
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0])
      updateBalance(accounts[0])
    } else {
      setAccount(null)
      setBalance(null)
    }
  }

  const updateBalance = async (address: string) => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(address)
        setBalance(ethers.formatEther(balance))
      }
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert(
        "Please install MetaMask!\n\nMetaMask is required to place bets with cryptocurrency.\n\nDownload at: https://metamask.io",
      )
      return
    }

    setIsConnecting(true)
    try {
      console.log("[v0] Requesting wallet connection...")
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      console.log("[v0] Wallet connected:", accounts[0])
      setAccount(accounts[0])
      await updateBalance(accounts[0])
    } catch (error: any) {
      console.error("[v0] Error connecting wallet:", error)
      if (error.code === 4001) {
        alert("Connection rejected. Please try again and approve the connection.")
      } else {
        alert("Failed to connect wallet. Please make sure MetaMask is unlocked.")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setBalance(null)
  }

  const placeBet = async (marketId: number, amount: string, prediction: "yes" | "no") => {
    if (!account) {
      alert("Please connect your wallet first!")
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // In a real implementation, you would interact with a smart contract here
      // For demo purposes, we'll simulate a transaction
      const tx = await signer.sendTransaction({
        to: "0x0000000000000000000000000000000000000000", // Replace with actual contract address
        value: ethers.parseEther(amount),
      })

      console.log("[v0] Transaction sent:", tx.hash)
      await tx.wait()
      console.log("[v0] Bet placed successfully:", { marketId, amount, prediction })

      alert(`Bet placed successfully! ${amount} ETH on ${prediction.toUpperCase()}`)
      await updateBalance(account)
    } catch (error) {
      console.error("Error placing bet:", error)
      alert("Failed to place bet. Please try again.")
    }
  }

  return (
    <Web3Context.Provider
      value={{
        account,
        balance,
        isConnecting,
        connectWallet,
        disconnectWallet,
        placeBet,
        refreshBalance: async () => {
          if (account) {
            await updateBalance(account)
          }
        },
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
