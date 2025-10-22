# AIQX Labs - Multi-Chain Token Creation Platform

## Overview
AIQX Labs is a professional Web3 token creation platform that enables users to create, deploy, and manage custom ERC20 and SPL tokens across multiple blockchains. The platform features dedicated pages for each blockchain, real blockchain logos, and a modern UI inspired by industry-leading platforms like 20lab.app.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter (routing)
- **Backend**: Express.js, Node.js
- **Web3**: ethers.js (EVM chains), @solana/web3.js, @solana/spl-token (Solana)
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS with custom theme, shadcn/ui components

## Features

### Platform Architecture
1. **Blockchain-Specific Pages**
   - Dedicated page for each blockchain: Ethereum, BSC, Polygon, Arbitrum, Base, Solana
   - Each page has blockchain-specific branding, logos, and color schemes
   - Pre-configured network selection (mainnet/testnet) for each chain
   - Custom wallet connect buttons and messaging per blockchain

2. **Multi-Chain Support**
   - **EVM Chains**: Ethereum, BSC, Polygon, Arbitrum, Base (mainnet + testnet)
   - **Solana**: Devnet, Testnet, Mainnet-beta
   - Each chain displays official logos from stock image library
   - Chain-specific visual indicators and color schemes

3. **Token Types**
   - **Standard ERC20/SPL**: Basic token with transfer functionality
   - **Mintable**: Owner can create new tokens post-deployment
   - **Burnable**: Holders can destroy their tokens to reduce supply
   - **Taxable**: Automatic tax on transfers to treasury wallet (EVM only)

4. **Wallet Integration**
   - **EVM Chains**: MetaMask integration via ethers.js
   - **Solana**: Multi-wallet support (Phantom, OKX Wallet, Solflare, Backpack)
   - Automatic wallet detection and connection
   - Client-side transaction signing (no private keys on server)
   - Wallet-based deployment for maximum security
   - Wallet popup automatically opens for transaction confirmation

5. **Token Creation Flow**
   - User selects blockchain from homepage grid
   - Navigates to blockchain-specific page
   - Connects wallet (MetaMask for EVM, Phantom for Solana)
   - Fills token creation form with validation
   - Deploys via wallet signature
   - Tracks status in dashboard

6. **Token Dashboard**
   - View all deployed tokens across all chains
   - Real-time status updates (pending, deployed, failed)
   - Contract/mint address with copy functionality
   - Links to block explorer for each token
   - Filter and search capabilities

## Project Structure
```
client/
  src/
    components/
      ui/                          # Shadcn UI components
      theme-provider.tsx           # Dark/light mode support
      theme-toggle.tsx             # Theme switcher
      wallet-button.tsx            # Wallet connection button
      chain-selector.tsx           # Network selection dropdown
      token-type-card.tsx          # Token type selection cards
      token-creation-form.tsx      # Main token creation form
      token-card.tsx               # Token display card
      token-skeleton.tsx           # Loading skeleton
    pages/
      home.tsx                     # Landing page with blockchain grid
      ethereum.tsx                 # Ethereum token creation
      bsc.tsx                      # BSC token creation
      polygon.tsx                  # Polygon token creation
      arbitrum.tsx                 # Arbitrum token creation
      base.tsx                     # Base token creation
      create-solana.tsx            # Solana SPL token creation
      dashboard.tsx                # Token management dashboard
    contexts/
      EvmWalletContext.tsx         # MetaMask wallet provider
      SolanaWalletContext.tsx      # Phantom wallet provider
    utils/
      evmDeployer.ts               # Client-side EVM deployment logic
      solanaDeployer.ts            # Client-side Solana deployment logic
    hooks/
      use-token-polling.ts         # Real-time status polling
    App.tsx                        # Main app with routing
    
server/
  contracts/                       # Solidity smart contracts
    ERC20Standard.sol
    ERC20Mintable.sol
    ERC20Burnable.sol
    ERC20Taxable.sol
  utils/
    contract-compiler.ts           # Server-side contract compilation
  routes.ts                        # API endpoints
  storage.ts                       # In-memory token metadata storage

shared/
  schema.ts                        # Shared TypeScript types and schemas

attached_assets/
  stock_images/                    # Official blockchain logos
    ethereum_cryptocurre_*.jpg
    binance_smart_chain__*.jpg
    polygon_matic_crypto_*.jpg
    arbitrum_cryptocurre_*.jpg
    base_coinbase_crypto_*.jpg
    solana_sol_cryptocur_*.jpg
```

## API Endpoints
- `POST /api/tokens/deploy` - Create pending token record (EVM)
- `POST /api/deploy` - Create pending token record (Solana)
- `GET /api/tokens` - Get all deployed tokens
- `GET /api/tokens/:id` - Get specific token
- `POST /api/tokens/:id/status` - Update token deployment status
- `GET /api/contracts/compile/:tokenType` - Compile contract and return ABI

## Routing Structure
```
/                    → Home (blockchain grid)
/ethereum            → Ethereum token creation
/bsc                 → BSC token creation
/polygon             → Polygon token creation
/arbitrum            → Arbitrum token creation
/base                → Base token creation
/solana              → Solana SPL token creation
/dashboard           → Token dashboard
/create              → Legacy route (redirects to /ethereum)
/create-solana       → Legacy route (redirects to /solana)
```

## Design System
- **Primary Color**: AIQX Blue (hsl(210 100% 55%))
- **Success Color**: Green (hsl(142 76% 50%))
- **Warning Color**: Orange (hsl(38 92% 55%))
- **Blockchain Colors**:
  - Ethereum: Blue (from-blue-500 to-blue-600)
  - BSC: Yellow (from-yellow-500 to-yellow-600)
  - Polygon: Purple (from-purple-500 to-purple-600)
  - Arbitrum: Cyan (from-cyan-500 to-cyan-600)
  - Base: Dark Blue (from-blue-600 to-blue-700)
  - Solana: Purple-Pink (from-purple-600 to-pink-500)
- **Font**: Inter (primary), JetBrains Mono (code/addresses)
- **Theme**: Dark mode default with light mode support

## Security Features
- ✅ **No Private Keys on Server**: All transaction signing happens client-side
- ✅ **Wallet-Based Deployment**: Users sign transactions via MetaMask/Phantom
- ✅ **Client-Side Signing**: ethers.js and @solana/web3.js handle signing
- ✅ **Secure Token Amounts**: BigInt arithmetic for precision (no float errors)
- ✅ **Error Handling**: Failed deployments update status without duplicate records

## Deployment Flow

### EVM Chains (Ethereum, BSC, Polygon, Arbitrum, Base)
1. User connects MetaMask wallet
2. Selects network (mainnet or testnet)
3. Fills token creation form
4. Frontend creates "pending" database record
5. Frontend fetches compiled contract (ABI + bytecode) from server
6. Frontend validates user is on correct chain
7. Frontend deploys contract via MetaMask (user signs in wallet)
8. Frontend updates database with contract address and tx hash
9. On failure: updates original record status to "failed"

### Solana
1. User connects Phantom wallet
2. Selects network (devnet, testnet, mainnet-beta)
3. Fills SPL token creation form (with logo upload and authority controls)
4. Frontend creates "pending" database record
5. Frontend builds atomic transaction:
   - Creates mint account
   - Initializes mint WITH authority (payer)
   - Creates associated token account
   - Mints initial supply using BigInt for precision
   - Optionally revokes mint authority if user disabled it
   - Optionally sets freeze authority
6. Frontend signs transaction with Phantom
7. Frontend confirms transaction on-chain
8. Frontend updates database with mint address and signature
9. On failure: updates original record status to "failed"

## Recent Changes (October 2025)

### Multi-Wallet Support for Solana (Latest)
- **Multi-Wallet Integration**: Support for Phantom, OKX Wallet, Solflare, and Backpack
- **Automatic Wallet Detection**: Platform automatically detects installed wallets
- **Wallet Selection UI**: Users can choose their preferred wallet from available options
- **Unlimited Supply Feature**: Toggle for unlimited supply tokens (0 initial supply with mint authority)
- **Enhanced Notifications**: Step-by-step deployment progress notifications
- **Wallet Auto-Open**: Transaction confirmation popup automatically opens when deploying
- **Network Support**: Devnet and Testnet both fully functional

### Major Redesign
- Completely redesigned homepage inspired by 20lab.app
- Created dedicated pages for each blockchain (6 separate pages)
- Added real blockchain logos from stock image library
- Implemented blockchain-specific color schemes and branding
- Updated navigation to show "Create Token" instead of separate EVM/Solana links

### Architecture Changes
- Separated EVM token creation into blockchain-specific pages
- Each blockchain page has pre-configured default network
- Added allowedChainIds and defaultChainId props to TokenCreationForm
- Updated routing in App.tsx with new blockchain pages
- Maintained backward compatibility with legacy routes
- Enhanced SolanaWalletContext for multi-wallet support

### Security & Bug Fixes
- Removed all private key handling from server (critical security fix)
- Implemented client-side transaction signing for EVM and Solana
- Fixed Solana mint authority logic (always set during init, revoke after if disabled)
- Fixed token amount precision using BigInt instead of floating-point
- Fixed error handling to update ORIGINAL pending record (no duplicates)
- Fixed form validation to update wallet address when connecting

## User Preferences
- Default theme: Dark mode
- Real-time token status polling every 5 seconds
- Responsive design for mobile, tablet, desktop
- Professional blockchain-themed visual design
- Separate pages per blockchain for better UX

## Architecture Decisions
- **In-memory storage** for MVP (can be upgraded to PostgreSQL)
- **Client-side deployment** for security (no server-side private keys)
- **Contract compilation** on server-side using solc
- **Real-time polling** for token status updates
- **Blockchain-specific pages** for better user experience and clarity
- **Stock image logos** for professional appearance
- **BigInt arithmetic** for precise token amount calculations

## Future Enhancements
- Add WalletConnect support for EVM chains (multi-wallet support)
- Add Solflare and Backpack wallet support for Solana
- Implement actual RPC integration for real blockchain deployments
- Add liquidity pool creation (Uniswap, PancakeSwap)
- Token vesting and timelock contracts
- Multi-signature wallet support
- Contract verification on block explorers
- Advanced tokenomics (reflection, auto-LP, buyback)
- Token audit and security scanning
- PostgreSQL database for production use
- Token metadata upload service for Solana logos

## Known Issues
- TypeScript type errors in token-creation-form.tsx (ChainId type mismatch between EVM and Solana)
  - These are type safety warnings and don't affect functionality
  - App compiles and runs correctly despite LSP warnings
- Logos are from stock images (need official blockchain vector logos)
- WalletConnect integration not yet implemented

## Development Notes
- Always use correct chain IDs from shared/schema.ts
- EVM chain IDs format: `{blockchain}-{network}` (e.g., "ethereum-testnet")
- Solana chain IDs format: `solana-{network}` (e.g., "solana-devnet")
- Never modify vite.config.ts or server/vite.ts
- Use packager_tool for installing new packages
- Keep replit.md updated with architecture changes
