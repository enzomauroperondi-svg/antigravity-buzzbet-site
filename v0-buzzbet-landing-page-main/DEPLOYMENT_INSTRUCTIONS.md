# Buzzbet Deployment Instructions

## The Issue
Your deployed site at v0-buzzbet-landing-page.vercel.app is showing an **old cached version** with prices (68¢, 32¢) instead of the new odds multipliers (1.67x).

## Solution: Deploy Latest Code via v0

### Step 1: Publish from v0
1. In the v0 interface, find the **"Publish"** button in the top right corner
2. Click "Publish" to push the latest code to Vercel
3. Wait for the deployment to complete (you'll see a success message)

### Step 2: Hard Refresh Your Browser
After deployment completes, clear your browser cache:
- **Windows/Linux**: Press `Ctrl + Shift + R`
- **Mac**: Press `Cmd + Shift + R`
- **Alternative**: Open in an incognito/private window

### Step 3: Verify Deployment
Look for these signs that the new version is live:
1. You should see "**v2.0 - Dynamic Odds System Active**" text above the markets
2. Odds should display as multipliers like "**1.67x**" (not cents like "68¢")
3. Both Yes and No options should show equal odds initially

## Why This Happens
- Vercel caches deployments for performance
- Redeploying from Vercel dashboard may redeploy an old build
- Browser caching can show outdated versions even after new deployments

## Current System Status
✅ Backend API is working correctly (returning oddsYes: 1.67, oddsNo: 1.67)
✅ Frontend component is correctly displaying odds with "x" format
✅ Dynamic odds calculation algorithm is implemented
✅ MetaMask integration is ready
❌ Deployed site needs to be updated via v0 Publish button

## Need Help?
If after publishing and hard refresh you still see prices instead of odds:
1. Check browser console for any errors
2. Verify the deployment timestamp in Vercel dashboard matches your publish time
3. Try accessing the site from a different device or network
