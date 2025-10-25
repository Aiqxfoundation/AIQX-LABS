# AIQX Labs - Multi-Chain Token Creation Platform

## Overview
AIQX Labs is a professional Web3 token creation and management platform inspired by Smithii Tools. It offers a clean, minimal interface for dedicated multi-chain token creation across Ethereum, BSC, Polygon, Arbitrum, Base, and Solana, with comprehensive tools for each blockchain. The platform aims to provide a production-ready solution for users to create and manage tokens with various features, including authority management and metadata updates, securely and efficiently.

## User Preferences
- Default theme: Dark mode (always on)
- Minimal design: Single cyan accent (#00d4ff), no gradients or effects
- Real-time token status polling every 5 seconds
- Responsive design for mobile, tablet, desktop
- Flat navigation structure with all features visible

## System Architecture

### UI/UX Decisions
The platform adopts a minimal, professional design inspired by Smithii Tools.
- **Minimal Color Palette**: Dark background (#05080d) with a single cyan accent (#00d4ff).
- **Flat Navigation**: A slide-out drawer menu provides access to all features: Home, Token Creation (expandable by chain), EVM Tools, Solana Tools (8 individual tools), and Dashboard.
- **Clean Typography**: White text on dark backgrounds, gray muted text, using the Inter font family.
- **Simple Cards**: Border-only cards with gray-800 borders.
- **Direct Page Navigation**: Each feature has its own dedicated page.
- **Responsive Layout**: Mobile-first design with a hamburger menu.

### Technical Implementations
- **Frontend**: React 18, TypeScript, Wouter for routing, and TanStack Query for state management.
- **Backend**: Express.js with Node.js and TypeScript.
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM.
- **Web3 Libraries**: `ethers.js` for EVM chains, `@solana/web3.js`, `@solana/spl-token`, and `@metaplex-foundation/js` for Solana.
- **Security**: All transactions are signed client-side via the user's wallet; no private keys are stored on the server.
- **Wallets**: Supports MetaMask for EVM, and Phantom, OKX Wallet, Solflare, and Backpack for Solana.
- **Performance**: `React.lazy` for lazy loading Solana pages.
- **Validation**: Comprehensive form validation using Zod schemas.
- **Deployment**: Configured for Replit autoscale deployment.

### Feature Specifications
**Multi-Chain Support**:
- **EVM Chains**: Ethereum, BSC, Polygon, Arbitrum, Base (mainnet + testnets).
- **Solana**: Devnet, Testnet, Mainnet-Beta.
- Unified token creation flow for EVM chains and a dedicated flow for Solana.

**Token Creation**:
- **EVM**: Supports Standard, Mintable, Burnable, Pausable, Capped, and Taxable token types, with the ability to combine multiple features.
- **Solana**: Supports SPL tokens with metadata, utilizing Irys for decentralized storage of images and metadata.
- Real-time network fee estimation and client-side deployment.

**Authority Management**:
- Dedicated page for revoking token authorities on both EVM and Solana chains.
- For EVM, users can renounce ownership, disable minting, or disable pausing.
- For Solana, users can revoke mint and freeze authorities.

**Solana Tools (8 Individual Pages)**:
1. Multisender
2. Transfer Authority
3. Revoke Mint Authority
4. Revoke Freeze Authority
5. Mint Tokens
6. Burn Tokens
7. Freeze/Unfreeze Account
8. Update Metadata (with simplified image/metadata handling)

**EVM Tools**:
- Multisender (placeholder).

**Dashboard**:
- Overview of deployed tokens across all supported chains with real-time status and block explorer links.

### System Design Choices
- **Client-Side Deployment**: Ensures maximum security by having users sign transactions directly from their wallets.
- **PostgreSQL Database**: Persists token metadata and deployment information using a serverless Neon database with Drizzle ORM.
- **Server-Side Compilation**: Solidity contracts are compiled on-demand using `solc`.
- **Lazy Loading**: Optimizes performance by loading heavy dependencies only when needed.
- **Flat Architecture**: Improves user experience by providing direct navigation to individual features.
- **Minimal Design**: Focuses on clarity and usability with a single accent color and no unnecessary visual effects.

## External Dependencies
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter, TanStack Query, Framer Motion.
- **Backend**: Express.js, Node.js.
- **Web3**: `ethers.js`, `@solana/web3.js`, `@solana/spl-token`, `@metaplex-foundation/js`.
- **Wallets**: MetaMask, Phantom, OKX Wallet, Solflare, Backpack.
- **Development Tools**: `solc` (Solidity compiler), `tsx`, `vite`.
- **Database**: Neon (PostgreSQL).
- **Decentralized Storage**: Irys (for Solana metadata).