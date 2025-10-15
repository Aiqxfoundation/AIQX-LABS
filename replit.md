# AIQX Labs - Multi-Chain Token Creation Platform

## Overview
AIQX Labs is a professional Web3 token creation platform that enables users to create, deploy, and manage custom ERC20 tokens across multiple blockchains including Ethereum, BSC, Polygon, Arbitrum, and Base.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Web3**: ethers.js, Solidity smart contracts
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter

## Features
### MVP Features
1. **Multi-Chain Support**
   - Ethereum, BSC, Polygon, Arbitrum, Base
   - Easy network switching
   - Chain-specific visual indicators

2. **Token Types**
   - Standard ERC20: Basic token with transfer functionality
   - Mintable: Owner can create new tokens
   - Burnable: Holders can destroy their tokens  
   - Taxable: Tax on transfers to treasury wallet

3. **Wallet Integration**
   - MetaMask connection
   - WalletConnect support
   - Address display and management

4. **Token Creation Flow**
   - Intuitive form with validation
   - Token identity configuration (name, symbol, decimals, supply)
   - Token type selection with visual cards
   - Tax configuration for taxable tokens
   - Blockchain network selection

5. **Token Dashboard**
   - View all deployed tokens
   - Real-time status updates (pending, deployed, failed)
   - Contract address with copy functionality
   - View on block explorer
   - Beautiful loading states

## Project Structure
```
client/
  src/
    components/         # Reusable UI components
      ui/              # Shadcn components
      theme-provider.tsx
      theme-toggle.tsx
      wallet-button.tsx
      chain-selector.tsx
      token-type-card.tsx
      token-creation-form.tsx
      token-card.tsx
      token-skeleton.tsx
    pages/             # Application pages
      home.tsx         # Landing page with hero
      create.tsx       # Token creation page
      dashboard.tsx    # Token management dashboard
    hooks/             # Custom React hooks
      use-token-polling.ts
    App.tsx            # Main app with routing
    
server/
  contracts/           # Solidity smart contracts
    ERC20Standard.sol
    ERC20Mintable.sol
    ERC20Burnable.sol
    ERC20Taxable.sol
  utils/              # Utilities
    contract-compiler.ts
  routes.ts           # API endpoints
  storage.ts          # In-memory storage

shared/
  schema.ts           # Shared TypeScript types and schemas
```

## API Endpoints
- `POST /api/tokens/deploy` - Deploy a new token
- `GET /api/tokens` - Get all deployed tokens
- `GET /api/tokens/:id` - Get specific token
- `POST /api/tokens/:id/status` - Update token status
- `GET /api/contracts/compile/:tokenType` - Compile contract

## Design System
- **Primary Color**: AIQX Blue (hsl(210 100% 55%))
- **Success Color**: Green (hsl(142 76% 50%))
- **Warning Color**: Orange (hsl(38 92% 55%))
- **Chain Colors**: 
  - Ethereum: Green (hsl(120 100% 35%))
  - BSC: Orange (hsl(30 100% 50%))
  - Polygon: Purple (hsl(270 70% 55%))
- **Font**: Inter (primary), JetBrains Mono (code/addresses)
- **Dark Mode**: Default theme with light mode support

## User Preferences
- Default theme: Dark mode
- Real-time token status polling every 5 seconds
- Responsive design for mobile, tablet, desktop

## Recent Changes
- 2025-10-15: Initial platform creation
- Implemented all 4 token types with Solidity contracts
- Built complete frontend with wallet integration
- Created token dashboard with real-time updates
- Added beautiful loading and empty states

## Architecture Decisions
- In-memory storage for MVP (can be upgraded to PostgreSQL)
- Mock deployment simulation for demo (3 second delay)
- Contract compilation on server-side using solc
- Real-time polling for token status updates
- Blockchain-themed visual design with chain-specific colors

## Future Enhancements
- Actual blockchain deployment with RPC integration
- Liquidity pool creation (Uniswap, PancakeSwap)
- Token vesting and timelock contracts
- Multi-signature wallet support
- Contract verification on block explorers
- Advanced tokenomics (reflection, auto-LP, buyback)
- Token audit and security scanning
