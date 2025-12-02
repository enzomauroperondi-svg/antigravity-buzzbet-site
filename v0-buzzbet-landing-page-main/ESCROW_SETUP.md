# Escrow Address Setup & Fund Management

## ⚠️ IMPORTANT: Where Your Cryptocurrency Goes

When users place bets on Buzzbet, their cryptocurrency (ETH) is sent to an **escrow address**. This address holds all the funds until markets are resolved and winners claim their payouts.

### Current Setup

The current escrow address is set in `components/betting-modal.tsx`:

\`\`\`typescript
const ESCROW_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_ADDRESS || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
\`\`\`

**⚠️ WARNING:** The default address `0x742d35Cc6634C0532925a3b844Bc454e4438f44e` is a placeholder. If you don't change this, funds will go to an address you don't control!

---

## How to Set Up Your Own Escrow Address

### Option 1: Use Your Own Wallet (Recommended for Testing)

1. **Create a dedicated wallet** for Buzzbet escrow (don't use your personal wallet)
2. **Copy the wallet address** from MetaMask or your preferred wallet
3. **Add it to your environment variables**:
   - Go to your Vercel project settings
   - Add a new environment variable:
     - Name: `NEXT_PUBLIC_ESCROW_ADDRESS`
     - Value: Your wallet address (e.g., `0xYourWalletAddress...`)
4. **Redeploy your application**

### Option 2: Deploy a Smart Contract (Recommended for Production)

For a production application, you should deploy a smart contract that:
- Holds funds in escrow
- Automatically distributes payouts based on market resolution
- Prevents unauthorized withdrawals
- Provides transparency for all users

**Basic Smart Contract Example (Solidity):**

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BuzzbetEscrow {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    // Accept ETH deposits
    receive() external payable {}
    
    // Owner can withdraw to pay winners
    function payout(address payable recipient, uint256 amount) external {
        require(msg.sender == owner, "Only owner can payout");
        require(address(this).balance >= amount, "Insufficient balance");
        recipient.transfer(amount);
    }
}
