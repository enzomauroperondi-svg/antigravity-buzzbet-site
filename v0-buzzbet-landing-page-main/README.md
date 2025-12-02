# Buzzbet - Celebrity Prediction Market

A social, gamified prediction market platform focused on celebrity events and pop culture.

## Features

### Core Functionality
- **Dynamic Odds System**: Odds automatically adjust based on betting pools using a market-making algorithm
- **MetaMask Integration**: Connect wallet and place bets with cryptocurrency (ETH)
- **Real-time Updates**: Market odds update every 5 seconds with animated transitions
- **Social Leaderboard**: Track top predictors and their winnings

### Technical Implementation
- **Frontend**: Next.js 15 with React Server Components
- **Styling**: Tailwind CSS with custom design system
- **Web3**: ethers.js v6 for blockchain interactions
- **API**: Next.js API routes with in-memory data store

## How It Works

### Dynamic Odds Algorithm
Each market maintains pools of ETH bet on "Yes" and "No" outcomes. Odds are calculated using:

\`\`\`javascript
function calculateOdds(totalYes, totalNo, k = 1) {
  const totalPool = totalYes + totalNo;
  const oddsYes = totalPool / (totalYes + k);
  const oddsNo = totalPool / (totalNo + k);
  return { oddsYes, oddsNo };
}
\`\`\`

- Markets start with equal pools (5.0 ETH on each side) → equal odds (~1.67x)
- As more bets come in on one side, that side's odds decrease
- The less popular side becomes more attractive with higher multipliers
- The `k` parameter (set to 1) prevents extreme odds at low liquidity

### Betting Flow
1. User connects MetaMask wallet
2. User selects a market and clicks "Yes" or "No"
3. User enters bet amount in ETH
4. Transaction is sent to blockchain via MetaMask
5. After confirmation, backend updates pools and recalculates odds
6. All users see updated odds within 5 seconds

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── markets/route.ts       # GET markets with dynamic odds
│   │   ├── place-bet/route.ts     # POST bet and update pools
│   │   └── leaderboard/route.ts   # GET top predictors
│   ├── page.tsx                   # Main landing page
│   ├── layout.tsx                 # Root layout with Web3Provider
│   └── globals.css                # Global styles with design tokens
├── components/
│   ├── header.tsx                 # Navigation with wallet connect
│   ├── hero.tsx                   # Hero section with CTA
│   ├── trending-markets.tsx       # Market cards with live odds
│   ├── betting-modal.tsx          # Bet placement interface
│   ├── leaderboard.tsx            # Top predictors ranking
│   ├── why-buzzbet.tsx            # NABC value proposition
│   └── footer.tsx                 # Footer with links
├── lib/
│   ├── web3-context.tsx           # Web3 wallet connection logic
│   └── markets-store.ts           # Shared market data store
└── DEPLOYMENT_INSTRUCTIONS.md     # How to deploy latest version
\`\`\`

## Deployment

See [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md) for detailed steps.

**Quick Start:**
1. Click "Publish" in v0 interface
2. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
3. Verify "v2.0 - Dynamic Odds System Active" appears

## Usage

1. **Connect Wallet**: Click "Connect Wallet" in the header to connect your MetaMask
2. **Browse Markets**: Scroll through trending celebrity prediction markets
3. **Place Bets**: Click "Yes" or "No" on any market to open the betting modal
4. **Enter Amount**: Specify your bet amount in ETH
5. **Confirm**: Review the potential return and confirm the MetaMask transaction
6. **Watch Odds Update**: See the odds adjust in real-time as bets are placed

## Project NABC

**Need**: People constantly discuss celebrities but lack an interactive way to engage; current betting apps focus only on sports.

**Approach**: A fun, easy-to-use app that lets users predict celebrity events with friends, featuring gamification and social interaction.

**Benefit**: Provides entertainment, social engagement, and small rewards for accurate predictions.

**Competition**: Competes with sports betting platforms and Polymarket; Buzzbet stands out by focusing on pop culture, accessibility, and fun.

## Why This Space

A large, untapped opportunity combining entertainment, social media, and prediction markets.

## How We'll Win

First mover in the celebrity prediction niche; viral, gamified, and community-driven experience.

## Requirements

- MetaMask browser extension
- Modern web browser with JavaScript enabled
- HTTPS connection (required by MetaMask in production)
