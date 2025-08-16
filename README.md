# Meme NFT Minter Frontend

A beautiful, macOS-style frontend for the Meme NFT Minter built on Aptos blockchain.

## Features

- 🎨 **Beautiful macOS-style UI** with Claude AI-inspired typography
- 🔗 **Wallet Integration** with support for Petra, Martian, and Fewcha wallets
- 🚀 **NFT Minting** with custom names and prices
- 🛒 **NFT Marketplace** for buying and selling
- 📱 **Responsive Design** that works on all devices
- ⚡ **Built with React & TypeScript** for type safety and performance

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Wallet Setup

1. Install a supported Aptos wallet:
   - [Petra Wallet](https://petra.app/)
   - [Martian Wallet](https://martianwallet.xyz/)
   - [Fewcha Wallet](https://fewcha.app/)

2. Switch to Aptos Testnet
3. Get some test APT from the [Aptos Faucet](https://aptoslabs.com/testnet-faucet)

## Smart Contract

The frontend interacts with the Meme NFT smart contract deployed on Aptos testnet:
- Contract Address: `0x64f6979360f13452cd87d367490075326f8e73d21a8bc746695f8d15e12e2016`
- Module: `MemeNFTMinter`

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Aptos TS SDK** for blockchain interactions
- **Aptos Wallet Adapter** for wallet connections
- **Heroicons & Lucide React** for icons

## Build for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Design System

The UI uses a custom design system with:
- **Colors**: Primary blues with elegant grays
- **Typography**: Claude AI-inspired system fonts
- **Components**: Glass morphism and rounded corners
- **Animations**: Smooth transitions and hover effects

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
