# 🧿 ZenDesk - A Web3 NFT Marketplace

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), developed as part of a university initiative at SRMIST.

ZenDesk is a full-fledged NFT marketplace built with **Next.js**, **Web3.js**, and **Solidity**, focused on reducing gas fees using Layer 2 scaling. It integrates smart contract automation, multi-token support, fiat payment options, and monetization through Google AdSense.

---

## 🚀 Features

- ⚡ **Layer 2 Scaling** for minimal gas fees (Polygon / Optimism)
- 💳 **Multi-token & Fiat Payments** using MetaMask and Stripe
- 🧠 **Smart Contract Automation** (minting, transferring, verifying)
- 🧾 **Batch Processing** for grouped transactions
- 📈 **Ads Integration** (Google AdSense)
- 🧰 **Secure MongoDB Backend** for NFT metadata & users
- 🛡️ **Wallet-based Auth (MetaMask)**

---

## 📦 Tech Stack

- **Frontend**: Next.js, TailwindCSS, React Icons
- **Backend**: Node.js, Express.js, MongoDB
- **Blockchain**: Solidity (Ethereum), Polygon (L2)
- **Web3 Tools**: Web3.js, MetaMask, WalletConnect
- **Payments**: Stripe (Fiat), MetaMask (Crypto)
- **Hosting**: Vercel (Frontend), Render/AWS (Backend)

---

## 💡 Architecture

```txt
Next.js UI → Web3.js → Solidity Smart Contracts (Polygon)
        ↓
    Express API → MongoDB
        ↓
Google AdSense + Stripe Monetization


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more ǚdetails.

![image](https://github.com/user-attachments/assets/03ff60a6-cded-4498-a790-57c60e4cf6b0)

