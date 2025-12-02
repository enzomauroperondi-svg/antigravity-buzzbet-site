# How to Resolve Markets and Pay Winners

This guide explains the complete process for resolving markets and distributing winnings to winners.

## Overview

Buzzbet has a complete winner determination and payout system:

1. **Users place bets** → Bets are recorded with wallet addresses
2. **Admin resolves market** → Declares which side (Yes/No) won
3. **System calculates winners** → Determines payouts based on pool distribution
4. **Users claim winnings** → Winners withdraw their earnings via MetaMask

## Step-by-Step Process

### 1. Users Place Bets

When a user places a bet:
- They send ETH via MetaMask to the betting contract
- The bet is recorded with: `marketId`, `walletAddress`, `prediction`, `amount`, `txHash`
- The market pools are updated (`totalYes` and `totalNo`)
- Odds recalculate automatically

### 2. Admin Resolves Market

When the real-world event happens, an admin resolves the market:

**Access Admin Panel:**
- Navigate to: `https://your-site.com/admin`
- Enter admin key: `buzzbet_admin_2025` (or set custom key via `ADMIN_KEY` env var)

**Resolve Process:**
1. Enter Market ID (1-6 for the default markets)
2. Select the winner (Yes or No)
3. Click "Resolve Market"

**What Happens:**
- Market is marked as `resolved: true`
- Winner side is recorded (`winner: "yes"` or `winner: "no"`)
- All bets on that market are evaluated
- Winnings are calculated for each winner

### 3. Winnings Calculation

The system calculates winnings using a **proportional pool distribution**:

\`\`\`typescript
Total Pool = totalYes + totalNo
Winning Pool = winner === "yes" ? totalYes : totalNo

User Share = (User's Bet Amount) / (Winning Pool)
User Winnings = User Share × Total Pool
\`\`\`

**Example:**
- Market: "Will Taylor Swift announce new album?"
- Total Pool: 10 ETH (7 ETH on Yes, 3 ETH on No)
- Result: Yes wins
- User bet: 1 ETH on Yes

\`\`\`
User Share = 1 ETH / 7 ETH = 14.29%
User Winnings = 14.29% × 10 ETH = 1.43 ETH
User Profit = 1.43 - 1.00 = 0.43 ETH
\`\`\`

### 4. Users Claim Winnings

**User Process:**
1. Connect wallet at `https://your-site.com/winnings`
2. System shows all claimable winnings
3. Click "Claim X ETH" button
4. Confirm MetaMask transaction
5. Winnings are sent to user's wallet

**What Happens:**
- System fetches all user's bets
- Filters for resolved markets where user won
- Calculates total claimable amount
- Sends ETH from contract/treasury to user
- Marks bets as `paidOut: true`

## API Endpoints

### Place Bet
\`\`\`
POST /api/place-bet
Body: { marketId, prediction, amount, txHash, walletAddress }
\`\`\`

### Resolve Market (Admin Only)
\`\`\`
POST /api/resolve-market
Body: { marketId, winner, adminKey }
Response: { market, winners, totalWinners, totalPayouts }
\`\`\`

### Check Winnings
\`\`\`
POST /api/claim-winnings
Body: { walletAddress }
Response: { claimableWinnings, totalClaimable, totalBets }
\`\`\`

### Mark as Paid
\`\`\`
PUT /api/claim-winnings
Body: { betId, txHash }
\`\`\`

## Production Considerations

### Security
- Change default admin key via `ADMIN_KEY` environment variable
- Implement proper admin authentication (JWT, role-based access)
- Add rate limiting to prevent abuse
- Use multi-sig wallet for treasury management

### Smart Contracts
Currently, the system uses a simple transaction model. For production:
- Deploy a proper betting smart contract
- Implement automated market resolution via oracles (Chainlink, etc.)
- Add dispute resolution mechanisms
- Include time locks and market deadlines

### Database
For production scalability:
- Replace in-memory storage with PostgreSQL/MongoDB
- Add indexing on wallet addresses and market IDs
- Implement transaction history tracking
- Add analytics for betting patterns

### Payout Automation
Consider implementing:
- Automated payouts after market resolution
- Batch processing for multiple winners
- Gas optimization for large payouts
- Email/push notifications for winnings

## Troubleshooting

**Market won't resolve:**
- Check admin key is correct
- Verify market ID exists (1-6)
- Ensure market isn't already resolved

**User can't see winnings:**
- Confirm wallet is connected
- Check market is resolved
- Verify user bet on winning side
- Ensure bet wasn't already paid out

**Payout fails:**
- Check contract has sufficient balance
- Verify gas settings in MetaMask
- Confirm transaction isn't already processed

## Example Workflow

1. **Market Created:** "Will Beyoncé perform at Super Bowl?"
2. **Users Bet:** 
   - Alice: 2 ETH on Yes
   - Bob: 1 ETH on Yes
   - Carol: 1 ETH on No
3. **Event Happens:** Beyoncé performs! ✨
4. **Admin Resolves:** Marks market with `winner: "yes"`
5. **Winnings Calculated:**
   - Total Pool: 4 ETH
   - Winning Pool (Yes): 3 ETH
   - Alice: (2/3) × 4 = 2.67 ETH (profit: 0.67 ETH)
   - Bob: (1/3) × 4 = 1.33 ETH (profit: 0.33 ETH)
   - Carol: 0 ETH (lost)
6. **Users Claim:**
   - Alice and Bob visit /winnings
   - Click claim and receive their ETH
   - System marks bets as paid

## Support

For technical support or questions about the payout system, contact your development team or refer to the codebase documentation.
