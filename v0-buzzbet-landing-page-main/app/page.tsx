import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { TrendingMarkets } from "@/components/trending-markets"
import { Portfolio } from "@/components/portfolio"
import { WhyBuzzbet } from "@/components/why-buzzbet"
import { Leaderboard } from "@/components/leaderboard"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TrendingMarkets />
        <Portfolio />
        <WhyBuzzbet />
        <Leaderboard />
      </main>
      <Footer />
    </div>
  )
}
