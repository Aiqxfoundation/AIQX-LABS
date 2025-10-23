# AIQX Labs - Multi-Chain Token Creation Platform

## Overview
AIQX Labs is a production-ready professional Web3 token creation platform with a clean, minimal interface inspired by Smithii Tools standards. The platform provides dedicated pages for multi-chain token creation and management across Ethereum, BSC, Polygon, Arbitrum, Base, and Solana, with comprehensive tools for each blockchain.

## Recent Changes (October 23, 2025)

### Latest Fix
- **Solana Page Loading Fix**: Fixed critical issue where Solana tool pages (Update Metadata, Multisender, etc.) failed to load due to Node.js module polyfill errors
  - Implemented dynamic imports for @metaplex-foundation/js to prevent loading heavy dependencies at module level
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
- **Frontend**: React 18, TypeScript, Wouter routing, TanStack Query for state
- **Backend**: Express.js, Node.js
- **Web3**: ethers.js (EVM), @solana/web3.js, @solana/spl-token, @metaplex-foundation/js
- **Security**: Client-side transaction signing only, no private keys on server
- **Wallets**: MetaMask (EVM), Phantom/OKX/Solflare/Backpack (Solana)
- **Performance**: React.lazy loading for Solana pages to prevent dependency conflicts
- **Validation**: Comprehensive form validation with Zod schemas

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
- **Client-Side Deployment**: All transactions signed in user's wallet
- **In-Memory Storage**: Token metadata stored server-side (non-persistent)
- **Server-Side Compilation**: Solidity contracts compiled via `solc`
- **Lazy Loading**: Heavy dependencies loaded only when needed
- **Flat Architecture**: Individual pages instead of nested hubs
- **Minimal Design**: Single accent color, no effects or gradients

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

## Future Enhancements
- EVM Multisender implementation
- Additional Solana tools (Tax Settings, Withdraw Fees for Token-2022)
- Persistent database storage
- Advanced token analytics
- Multi-signature support
