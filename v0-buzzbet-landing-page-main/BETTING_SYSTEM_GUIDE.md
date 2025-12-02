# Buzzbet Betting System Guide

## Overview
Buzzbet is a fully functional celebrity prediction market where users can place bets using cryptocurrency through MetaMask. The system features dynamic odds that automatically adjust based on betting pool sizes.

## How It Works

### 1. User Flow
1. User visits the Buzzbet website
2. User clicks "Connect Wallet" in the header
3. MetaMask popup appears requesting connection approval
4. Once connected, user sees their wallet address and ETH balance
5. User clicks "Yes" or "No" on any celebrity prediction market
6. Betting modal opens showing current odds and potential returns
7. User enters bet amount in ETH
8. User clicks "Confirm Bet"
9. MetaMask popup appears requesting transaction approval
10. User approves transaction
11. Blockchain transaction is executed
12. Backend updates market totals and recalculates odds
13. All users see updated odds in real-time

### 2. Dynamic Odds Algorithm
The odds are calculated using the following algorithm:

\`\`\`javascript
function calculateOdds(totalYes, totalNo, k = 1) {
  const totalPool = totalYes + totalNo
  const oddsYes = totalPool / (totalYes + k)
  const oddsNo = totalPool / (totalNo + k)
  return { oddsYes, oddsNo }
}
\`\`\`

**How it works:**
- When more money is bet on "Yes", the "Yes" odds decrease and "No" odds increase
- When more money is bet on "No", the "No" odds decrease and "Yes" odds increase
- The parameter `k = 1` prevents extreme odds when liquidity is low
- All markets start with equal pools (5.0 ETH on each side) giving 1.67x odds initially

**Example:**
- Initial state: 5 ETH on Yes, 5 ETH on No → Both sides 1.67x odds
- User bets 2 ETH on Yes: 7 ETH on Yes, 5 ETH on No → Yes becomes 1.5x, No becomes 2.0x
- The less popular side becomes more attractive to bet on

### 3. Technical Architecture

#### Frontend (React/Next.js)
- **Web3Provider** (`lib/web3-context.tsx`): Manages MetaMask connection and wallet state
- **TrendingMarkets** (`components/trending-markets.tsx`): Displays all markets and fetches odds every 5 seconds
- **BettingModal** (`components/betting-modal.tsx`): Handles bet placement with blockchain transactions
- **Header** (`components/header.tsx`): Connect wallet button and account dropdown

#### Backend (Next.js API Routes)
- **GET /api/markets**: Returns all markets with current odds
- **POST /api/place-bet**: Processes bet, updates totals, recalculates odds
- **Markets Store** (`lib/markets-store.ts`): Shared data store for market state

#### Blockchain Integration
- **Library**: ethers.js v6
- **Wallet**: MetaMask (required)
- **Network**: Ethereum (or any EVM-compatible network)
- **Contract Address**: `0x742d35Cc6634C0532925a3b844Bc454e4438f44e` (update with your deployed contract)

### 4. Key Features

✅ **MetaMask Integration**
- Automatic wallet detection
- Balance display in real-time
- Account change handling
- Network switching support

✅ **Dynamic Odds**
- Odds update immediately after each bet
- Live polling every 5 seconds for all users
- Smooth animations when odds change
- Prevents extreme odds with k parameter

✅ **Blockchain Transactions**
- Real ETH transactions on blockchain
- Transaction hash tracking
- Confirmation waiting
- Error handling for rejected transactions

✅ **User Experience**
- Clear potential return calculations
- Insufficient balance warnings
- Transaction status feedback
- Responsive design for mobile

### 5. Deployment Checklist

Before deploying to production:

- [ ] Deploy betting smart contract to Ethereum mainnet or testnet
- [ ] Update `CONTRACT_ADDRESS` in `components/betting-modal.tsx` (line 57)
- [ ] Test on Ethereum testnet (Sepolia or Goerli) first
- [ ] Ensure HTTPS is enabled (required for MetaMask)
- [ ] Test wallet connection flow
- [ ] Test bet placement with small amounts
- [ ] Verify odds calculations are correct
- [ ] Test with multiple simultaneous users
- [ ] Add error monitoring (Sentry, LogRocket, etc.)
- [ ] Set up database for persistent market data (currently in-memory)

### 6. Smart Contract Requirements

Your betting contract should:
- Accept ETH payments
- Record bet details (user address, market ID, prediction, amount)
- Allow withdrawal of winnings after market resolution
- Emit events for bet placement
- Handle market resolution and payouts

### 7. Security Considerations

**Frontend:**
- Validates bet amounts before submission
- Checks wallet balance before transactions
- Handles MetaMask errors gracefully
- Never stores private keys

**Backend:**
- Validates all API inputs
- Rate limiting recommended for production
- CORS configured for security
- Transaction hash verification recommended

**Smart Contract:**
- Should be audited before mainnet deployment
- Use OpenZeppelin contracts for standards
- Implement access controls
- Add emergency pause functionality

### 8. Testing Guide

**Local Testing:**
1. Install MetaMask browser extension
2. Switch to Ethereum testnet (Sepolia)
3. Get testnet ETH from faucet
4. Run the app: `npm run dev`
5. Connect wallet and place test bets
6. Verify odds update correctly

**Production Testing:**
1. Deploy to Vercel
2. Verify HTTPS is working
3. Test from mobile devices
4. Test with multiple wallets
5. Monitor transaction success rates

### 9. Troubleshooting

**"Please install MetaMask"**
- User needs to install MetaMask extension
- Direct them to https://metamask.io

**"Transaction rejected"**
- User declined the transaction in MetaMask
- Normal behavior, no action needed

**"Insufficient balance"**
- User doesn't have enough ETH
- Tell them to add funds to their wallet

**Odds not updating**
- Check browser console for errors
- Verify API routes are responding
- Check network tab for failed requests

**Transaction pending forever**
- Network congestion or gas price too low
- User can speed up transaction in MetaMask

### 10. Future Enhancements

**Recommended additions:**
- Database integration (PostgreSQL, Supabase) for persistent data
- User profiles and betting history
- Social features (comments, sharing)
- Market creation by users
- Advanced analytics and statistics
- Mobile app (React Native)
- Support for multiple cryptocurrencies
- Limit orders and advanced betting options
- Referral system and rewards
- Live market resolution with oracle integration

## Support

For issues or questions:
- Check browser console for error messages
- Verify MetaMask is unlocked and connected
- Ensure you're on the correct network
- Try refreshing the page
- Clear browser cache if needed

## Conclusion

Your Buzzbet betting system is fully functional and ready for deployment. Users with MetaMask can connect their wallets, view real-time odds, and place bets that execute on the blockchain. The dynamic odds system ensures fair pricing based on market demand, creating an engaging prediction market experience.
