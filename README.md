# Tip Jar - Farcaster Miniapp

A lightweight, production-ready Farcaster Miniapp that enables users to send crypto tips seamlessly inside the Farcaster ecosystem. Built for creators, communities, and apps that want simple, fast, onchain value transfer with minimal friction.

## 🚀 Overview

Tip Jar is a Farcaster Miniapp designed to make tipping as easy as reacting to a cast. It integrates onchain payments with an intuitive UI so users can:

Send small crypto tips to creators or community members

Support posts directly from within Farcaster

Track tip transactions transparently onchain

Plug into any Frame or Farcaster client that supports miniapps

The miniapp is optimized for speed, reliability, and UX simplicity — ideal for creators looking to monetize engagement or communities running reward loops.

✨ Features

One-tap tipping: Simple flow for sending tips directly within Farcaster.

Miniapp-native UI: Responsive interface optimized for Warpcast & other clients.

Supports multiple tokens (e.g., USDC, ETH, or any ERC-20 depending on configuration).

Secure wallet interactions via supported Farcaster wallet integrations.

Transaction history view (optional, depending on integration).

Customizable Tip Amounts: Pre-set buttons or user-entered values.

Developer-friendly setup with clear configuration and environment variables.

🧱 Tech Stack

Farcaster Miniapps SDK (Mini App Studio or custom build)

Next.js / React (if using a web wrapper)

Smart contract interactions: Ethers.js / viem

Hosting: Vercel / Cloudflare / any static host

Optional: A lightweight Solidity contract if the app manages tipping logic

📦 Project Structure

(Example — adjust based on your actual project)

/src
  /components
    TipForm.tsx
    SuccessScreen.tsx
  /lib
    farcaster.ts
    payments.ts
  /pages
    index.tsx
/contract
  TipJar.sol (optional)
README.md
package.json

⚙️ Setup & Installation

Clone the repository:

git clone https://github.com/<your-username>/tipjar-miniapp.git
cd tipjar-miniapp


Install dependencies:

npm install


Create a .env file:

NEXT_PUBLIC_FARCASTER_CLIENT_ID=...
NEXT_PUBLIC_RPC_URL=...
NEXT_PUBLIC_SUPPORTED_TOKENS=...


Run the development server:

npm run dev

🧪 How It Works
1. User Opens Miniapp

From a cast, link, or embedded frame.

2. Tip Interface Loads

User selects a preset amount or enters a custom value.

3. Wallet Connects

Prompt uses Farcaster-native signing or standard wallet flow.

4. Transaction Executes

Funds are sent directly to the creator’s wallet.

5. Confirmation Screen

Displays status + a link to the transaction explorer.

🔗 Smart Contract (Optional)

If the project uses a custom contract:

Contract name: TipJar

Purpose: route & record tips

Events: TipSent(sender, recipient, amount, token)

Chain: Base / Celo / Polygon / Any EVM network

(Share your contract if you want an exact section written.)

🧭 Roadmap

Add analytics dashboard

Add recurring tipping (“subscribe to support”)

Allow creators to customize their miniapp

Add NFT or badge rewards for supporters

🤝 Contributing

Pull requests are welcome!
Open an issue for features or bug reports.

📄 License

MIT License — free to use, modify, and deploy.