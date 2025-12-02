# Buzzbet Payout System Guide

## How Payouts Work

When you resolve a market as an admin, the system calculates all winners and their payouts, but **does not automatically send funds**. There are two ways to distribute winnings:

---

## Option 1: Admin Processes Payouts (Recommended)

After resolving a market on the `/admin` page, you'll see a **Winners List** with all users who won.

**Steps:**
1. Resolve the market by selecting the winner (Yes/No)
2. A green card appears showing all winners and their payout amounts
3. Click "Send Payouts to X Winners" button
4. Your MetaMask will open for each transaction
5. Approve each payout transaction in MetaMask
6. System sends ETH directly to each winner's wallet

**Important:** You (the admin) need to have enough ETH in your wallet to cover all payouts plus gas fees.

---

## Option 2: Winners Claim Manually

Winners can claim their own winnings without admin intervention.

**Steps for Users:**
1. Connect MetaMask wallet on Buzzbet
2. Navigate to `/winnings` page
3. View all claimable winnings from resolved markets
4. Click "Claim Winnings" button
5. Approve transaction in MetaMask
6. Receive ETH directly to their wallet

---

## Why Your Test Bet Didn't Pay Out

You mentioned placing a bet on Vini Jr and not receiving money back after resolving. Here's what happened:

### The Current System Flow:
1. ✅ You placed bet → ETH left your wallet
2. ✅ ETH was sent to escrow address: `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`
3. ✅ You resolved market as admin
4. ❌ **System calculated you won but didn't auto-send funds**
5. ❓ **You need to either:**
   - Go to `/winnings` page and click "Claim"
   - OR use admin panel to process payouts

---

## Important Notes About Your Test Bet

### Where Did Your Money Go?

Check your transaction on Etherscan to see where the funds were sent:
- Visit: `https://etherscan.io/tx/YOUR_TRANSACTION_HASH`
- Look at the "To" address
- That's where your ETH currently sits

### Recovering Your Funds

**If your bet was recorded:**
1. Visit `https://your-site.com/winnings` 
2. Connect the same wallet you bet with
3. You should see claimable winnings
4. Click "Claim" to receive your payout

**If your bet was NOT recorded:**
- Visit `/api/debug-bets` to see all recorded bets
- If your bet isn't there, the API failed after blockchain transaction
- The ETH is in the escrow address but not tracked by the system
- You'll need to manually retrieve it (requires contract owner access)

---

## Production Setup Required

### Current Issues:
1. **No Real Escrow Contract:** Funds go to a hardcoded address you may not control
2. **In-Memory Storage:** All bet data is lost when server restarts
3. **No Automatic Payouts:** Manual claiming or admin processing required

### What You Need to Deploy:
1. **Deploy Smart Contract:** Use the escrow contract template in `ESCROW_SETUP.md`
2. **Set Environment Variable:** `NEXT_PUBLIC_ESCROW_ADDRESS=your_contract_address`
3. **Add Database:** Replace in-memory storage with Supabase/Neon for persistence
4. **Test on Testnet:** Use Goerli or Sepolia before mainnet
5. **Fund Admin Wallet:** Keep enough ETH to process payouts

---

## Testing Recommendations

Before accepting real bets:
1. Use testnet (Goerli/Sepolia) with fake ETH
2. Test complete flow: bet → resolve → claim
3. Verify all transactions on testnet explorer
4. Ensure bet data persists across server restarts
5. Test with multiple wallet addresses

---

## Getting Your Test Money Back

**Immediate steps:**
1. Connect your MetaMask wallet to Buzzbet
2. Go to `/winnings` page
3. Check if your winnings appear
4. If yes: Click "Claim Winnings"
5. If no: Check `/api/debug-bets` to see if bet was recorded

**If bet wasn't recorded:**
- The ETH is likely lost to the dummy escrow address
- Consider it a test expense
- Future bets will work correctly once you deploy the proper escrow contract

---

## Questions?

Check these endpoints for debugging:
- `/api/debug-bets` - View all recorded bets
- `/api/markets` - View market states and pools
- `/winnings` - View your claimable winnings
