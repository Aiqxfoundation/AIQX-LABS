# AIQX Labs - Multi-Chain Token Creation Platform

## Overview
AIQX Labs is a production-ready professional Web3 token creation platform with a clean, minimal interface inspired by Smithii Tools standards. The platform provides dedicated pages for multi-chain token creation and management across Ethereum, BSC, Polygon, Arbitrum, Base, and Solana, with comprehensive tools for each blockchain.

## Recent Changes (October 25, 2025)

### Solana Token Metadata Update - Complete Overhaul
- **Simplified and Fixed Form**:
  - Removed confusing "Custom Metadata URI" field - users now only need Name, Symbol, and Image
  - Symbol field now accepts both uppercase and lowercase letters (no forced capitalization)
  - Image can be provided via URL or uploaded from device
  - Token selection from wallet with automatic loading on network change
  - Clear visual feedback with green checkmarks when files are ready
- **Proper Implementation with Metaplex JS SDK**:
  - Fixed critical Buffer import issue for browser compatibility
  - Integrated Irys decentralized storage for image and metadata uploads
  - Proper wallet adapter identity for secure transaction signing
  - Supports both Token Metadata Program v2 and v3
  - Step-by-step progress toasts: image upload → metadata upload → on-chain update
- **Enhanced Error Handling**:
  - Specific error messages for wallet rejection, insufficient balance, authority issues
  - Fallback to embedded base64 if Irys upload fails with clear user notification
  - Comprehensive validation for all input fields
- **Production Ready**:
  - Default network set to testnet for safer testing
  - All transactions require wallet signature (secure client-side signing)
  - Works with Phantom, OKX Wallet, Solflare, and Backpack wallets

### Navigation and Wallet Connection Improvements
- **Centralized Wallet Connection**: All wallet connections now handled exclusively through header button
  - Removed redundant wallet connection prompts from individual tool pages
  - Solana metadata update page now uses global wallet context
  - Header "Connect Wallet" button automatically connects to the active blockchain
- **Enhanced Navigation Structure**:
  - Added chain-specific "Tools" dropdown in header that appears when blockchain is selected
  - Removed "Explore All Tools" button from home page for cleaner UX
  - Disabled/unavailable tools properly shown as non-clickable menu items
- **Dual-Mode Logo Input for Solana**:
  - Token creation now supports both URL input and file upload via tabs
  - Proper mode isolation prevents data leakage between URL and upload modes
  - Defensive validation ensures only base64 data URIs sent in upload mode
  - Image preview shows only for uploaded files, not URL inputs
- **Code Quality Improvements**:
  - Fixed logo mode switching bug with proper state clearing
  - Added `handleLogoModeChange` function to manage mode transitions
  - Updated schema to support optional logoUrl for flexibility

### Previous Updates (October 24, 2025)
- **Fixed Solana Metadata Update Error**: Resolved "Cannot read properties of undefined" error
  - Implemented proper error handling with Metaplex SDK
  - Added dynamic imports to prevent browser compatibility issues
  - Improved user feedback with specific error messages
  - Added URI validation to ensure compliance with Metaplex spec (max 200 chars, must be URL)
- **Metadata Image Handling**: Updated to use URL-only input
  - Metadata URI must point to hosted JSON files (Metaplex requirement)
  - Both token creation and metadata update use URL input for logos/images
  - Added guidance for users to host images on Pinata, NFT.Storage, or Arweave
  - Prevents base64 data URIs that would exceed Metaplex limits and corrupt metadata
- **Enhanced User Experience**:
  - Clear instructions for image hosting requirements
  - Added helpful tooltips and character limits (32 for name, 10 for symbol, 200 for URI)
  - Improved error messages for better user guidance
  - Links to popular image hosting services in the UI
- **Verified Token Supply Minting**:
  - Confirmed EVM contracts correctly apply decimals (totalSupply * 10^decimals)
  - Verified Solana deployer uses BigInt for precise supply calculations
  - Both platforms mint exact supply amounts as specified by users
- **Wallet Connection**: Verified multi-wallet support
  - Phantom, OKX Wallet, Solflare, and Backpack all properly detected and supported
  - Auto-connection and proper event handling for all wallet providers

### Migration to Replit Environment
- **Database Migration**: Migrated from in-memory storage to PostgreSQL with Drizzle ORM
  - Configured Neon serverless database with WebSocket support
  - All token deployments now persist across server restarts
  - Implemented proper database connection pooling
- **Critical Bug Fixes**:
  - Fixed ES module `__dirname` issue in contract compiler using `fileURLToPath`
  - Replaced hardcoded Infura API key placeholders with public RPC endpoints
  - Configured WebSocket support for Neon database connections
- **Contract Compilation**: Server-side Solidity compilation fully operational for all token types
- **Production Ready**: All features tested and verified on testnet/devnet configurations

### Previous Updates (October 23, 2025)
- **Solana Page Loading Fix**: Fixed critical issue where Solana tool pages failed to load
  - Implemented dynamic imports for @metaplex-foundation/js
  - Added process and global polyfills in main.tsx for browser compatibility
  - All 8 Solana tool pages now load and function correctly

### Previous Updates
- **Complete Design Overhaul**: Transformed to minimal Smithii-inspired design with dark background (#05080d) and single cyan accent (#00d4ff)
- **Navigation Restructure**: Flat navigation structure with all features clearly visible as individual menu items
- **Individual Tool Pages**: Created 8 separate Solana tool pages (Multisender, Transfer Authority, Revoke Mint, Revoke Freeze, Mint Tokens, Burn Tokens, Freeze Account, Update Metadata)
- **Lazy Loading**: Implemented React.lazy for Solana pages to prevent Node.js dependency loading issues
- **Style Cleanup**: Removed all gradients, glows, glass effects, and flashy animations from global CSS
- **Code Organization**: Deleted legacy hub pages, unified EVM creation flow

## User Preferences
- Default theme: Dark mode (always on)
- Minimal design: Single cyan accent (#00d4ff), no gradients or effects
- Real-time token status polling every 5 seconds
- Responsive design for mobile, tablet, desktop
- Flat navigation structure with all features visible

## System Architecture

### UI/UX Decisions
The platform features a minimal, professional design inspired by Smithii Tools. Key design principles:
- **Minimal Color Palette**: Dark background (#05080d) with single cyan accent (#00d4ff), no gradients
- **Flat Navigation**: Slide-out drawer menu with all features clearly visible:
  - Home
  - Token Creation (expandable): All chains listed
  - EVM Tools: Multisender (Coming Soon)
  - Solana Tools (expandable): 8 individual tools as separate menu items
  - Dashboard
- **Clean Typography**: White text on dark backgrounds, gray muted text, Inter font family
- **Simple Cards**: Border-only cards with gray-800 borders, no shadows or effects
- **Direct Page Navigation**: Each feature opens a complete separate dedicated page
- **Responsive Layout**: Mobile-first with hamburger menu and full-width content areas

### Technical Implementations
- **Frontend**: React 18, TypeScript, Wouter routing, TanStack Query for state management
- **Backend**: Express.js, Node.js with TypeScript
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM for data persistence
- **Web3**: ethers.js (EVM), @solana/web3.js, @solana/spl-token, @metaplex-foundation/js
- **Security**: Client-side transaction signing only, no private keys on server
- **Wallets**: MetaMask (EVM), Phantom/OKX/Solflare/Backpack (Solana)
- **Performance**: React.lazy loading for Solana pages to prevent dependency conflicts
- **Validation**: Comprehensive form validation with Zod schemas
- **Deployment**: Configured for Replit autoscale deployment

### Feature Specifications
**Multi-Chain Support**:
- EVM Chains: Ethereum, BSC, Polygon, Arbitrum, Base (mainnet + testnets)
- Solana: Devnet, Testnet, Mainnet-Beta
- Unified creation flow for all EVM chains
- Dedicated Solana creation page

**Token Creation**:
- EVM: Standard, Mintable, Burnable, Taxable types
- Solana: SPL tokens with metadata
- Real-time network fee estimation
- Client-side deployment via wallet signature

**Solana Tools (8 Individual Pages)**:
1. **Multisender**: Batch token distribution
2. **Transfer Authority**: Transfer mint/freeze authority
3. **Revoke Mint Authority**: Permanently revoke minting
4. **Revoke Freeze Authority**: Permanently revoke freezing
5. **Mint Tokens**: Create additional tokens
6. **Burn Tokens**: Destroy tokens permanently
7. **Freeze/Unfreeze Account**: Control token account states
8. **Update Metadata**: Modify token name/symbol/URI

**EVM Tools**:
- Multisender (Coming Soon placeholder page)

**Dashboard**:
- View all deployed tokens across chains
- Real-time status updates
- Block explorer links

### System Design Choices
- **Client-Side Deployment**: All transactions signed in user's wallet for maximum security
- **PostgreSQL Database**: Token metadata persisted using Neon serverless database with Drizzle ORM
- **Server-Side Compilation**: Solidity contracts compiled on-demand via `solc`
- **Lazy Loading**: Heavy dependencies loaded only when needed to optimize performance
- **Flat Architecture**: Individual pages instead of nested hubs for better UX
- **Minimal Design**: Single accent color (#00d4ff), no effects or gradients

## File Structure
```
client/src/
├── pages/
│   ├── home.tsx                    # Homepage with blockchain selection
│   ├── create.tsx                  # Unified EVM token creation
│   ├── create-solana.tsx           # Solana token creation
│   ├── dashboard.tsx               # Token overview dashboard
│   ├── chain-overview.tsx          # Dynamic chain overview
│   ├── chain-create.tsx            # Routes to unified create pages
│   ├── chain-manage.tsx            # Chain-specific management
│   ├── chain-tools.tsx             # Routes to tool pages
│   ├── tools-evm.tsx               # EVM tools placeholder
│   ├── tools-solana.tsx            # Solana tools overview (legacy)
│   ├── manage-solana.tsx           # Solana token management
│   ├── solana-multisender.tsx      # Individual Solana tools...
│   ├── solana-transfer-authority.tsx
│   ├── solana-revoke-mint.tsx
│   ├── solana-revoke-freeze.tsx
│   ├── solana-mint-tokens.tsx
│   ├── solana-burn-tokens.tsx
│   ├── solana-freeze-account.tsx
│   └── solana-update-metadata.tsx
├── components/
│   ├── MainLayout.tsx              # Main app layout wrapper
│   ├── MobileMenu.tsx              # Flat navigation drawer
│   └── ui/                         # Shadcn UI components
├── contexts/
│   ├── EvmWalletContext.tsx        # EVM wallet management
│   └── SolanaWalletContext.tsx     # Solana wallet management
└── index.css                       # Minimal global styles
```

## External Dependencies
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter, TanStack Query, Framer Motion
- **Backend**: Express.js, Node.js
- **Web3**: ethers.js, @solana/web3.js, @solana/spl-token, @metaplex-foundation/js
- **Wallets**: MetaMask, Phantom, OKX Wallet, Solflare, Backpack
- **Development**: solc (Solidity compiler), tsx, vite

## Performance Optimizations
- Lazy loading for Solana pages to prevent dependency loading issues
- Minimal CSS with single accent color
- Optimized bundle with code splitting
- No heavy animation libraries or gradient effects

## Network Configuration
All networks are properly configured and ready for use:

**EVM Networks (Mainnet & Testnet)**:
- Ethereum (Mainnet + Sepolia)
- BSC (Mainnet + Testnet)
- Polygon (Mainnet + Amoy Testnet)
- Arbitrum (One + Sepolia)
- Base (Mainnet + Sepolia)

**Solana Networks**:
- Mainnet-Beta (Production)
- Testnet (Testing)
- Devnet (Development)

**Important**: Always test token creation on testnet/devnet before deploying to mainnet!

## Future Enhancements
- EVM Multisender implementation
- Additional Solana tools (Tax Settings, Withdraw Fees for Token-2022)
- Advanced token analytics
- Multi-signature support
- Token liquidity management features
