import { Header } from "@/components/header"
import { ClaimWinnings } from "@/components/claim-winnings"
import { Footer } from "@/components/footer"

export default function WinningsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Your Winnings</h1>
          <p className="text-muted-foreground mb-8">View and claim your winnings from resolved markets</p>
          <ClaimWinnings />
        </div>
      </main>
      <Footer />
    </div>
  )
}
