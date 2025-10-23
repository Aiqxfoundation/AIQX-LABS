# AIQX Labs - Multi-Chain Token Creation Platform

## Overview
AIQX Labs is a professional Web3 token creation platform offering a redesigned UI/UX for multi-chain token creation and management. The platform provides dedicated, branded hubs for Ethereum, BSC, Polygon, Arbitrum, Base, and Solana, each with specific tools. Its purpose is to be a leading, secure, and user-friendly platform in the Web3 token creation market, enabling users to easily create, manage, and utilize advanced token functionalities across various blockchains.

## User Preferences
- Default theme: Dark mode
- Real-time token status polling every 5 seconds
- Responsive design for mobile, tablet, desktop
- Professional blockchain-themed visual design
- Separate pages per blockchain for better UX

## System Architecture
### UI/UX Decisions
The platform features a major professional redesign inspired by tools.smithii.io, emphasizing clarity and blockchain separation. Key design principles include:
- **Chain-Specific Hubs**: Each blockchain has a dedicated hub with branded gradient headers and distinct color schemes (Ethereum: blue, BSC: yellow/amber, Polygon: purple, Arbitrum: cyan, Base: blue, Solana: purple-pink).
- **Navigation**: Slide-out drawer menu system with hamburger trigger, overlaying full-width content. Top header bar displays logo, chain info, and prominent "Connect Wallet" button. Menu shows Home, all blockchains, chain-specific tools when on a chain page, and Dashboard link.
- **Visual Design**: Production-grade design system featuring:
  - **Glassmorphism Effects**: Professional `.glass` and `.glass-light` utilities with backdrop blur
  - **Advanced Gradients**: `.gradient-primary`, `.gradient-mesh`, and `.border-gradient` for premium appearance
  - **Smooth Animations**: `.transition-smooth`, `.transition-fast`, and `.hover-lift` with optimized cubic-bezier easing
  - **Professional Shadows**: Multi-layered shadow system for depth and hierarchy
  - **Gradient Text**: Numbers and headings use gradient backgrounds clipped to text
  - **Large, Bold Icons**: 12x12 rounded icons with gradient backgrounds and shadows
  - **Premium Badges**: Gradient-filled badges with proper opacity and glow effects
- **Typography**: Inter for primary text, JetBrains Mono for code/addresses, leveraging Shadcn UI components with Tailwind CSS.
- **Responsiveness**: Mobile-first approach with full-width adaptive layouts, responsive stat cards, and optimized menu navigation.

### Technical Implementations
The frontend is built with React, TypeScript, and Wouter for routing, with state management handled by TanStack Query. The backend uses Express.js and Node.js. Web3 integration is managed by ethers.js for EVM chains and @solana/web3.js and @solana/spl-token for Solana. Security is prioritized with client-side transaction signing (no private keys on server). The platform supports multi-wallet integration (MetaMask for EVM; Phantom, OKX Wallet, Solflare, Backpack for Solana). Token creation forms include comprehensive validation and real-time network fee estimations. Supported token types are Standard, Mintable, Burnable, and Taxable (EVM only).

### Feature Specifications
- **Multi-Chain Support**: Dedicated pages for Ethereum, BSC, Polygon, Arbitrum, Base (mainnet + testnet), and Solana (Devnet, Testnet, Mainnet-Beta), with official logos and chain-specific visual indicators.
- **EVM Multisender Tool**: Allows batch sending of tokens to multiple addresses across all EVM chains via CSV import or manual input, featuring real-time validation, balance checking, error reporting, and sequential transaction execution.
- **Token Creation Flow**: Users select a blockchain, connect their wallet, complete a validated form, and deploy tokens via a wallet signature.
- **Solana Token Management**: Dedicated page to manage SPL token authorities (Mint, Freeze) post-deployment, including real-time status checking, permanent authority revocation, and explorer links.
- **Solana Advanced Tools**: A comprehensive dashboard offering 9 features: Multisender, Transfer Authority, Revoke Authority, Mint Tokens, Burn Tokens, Freeze/Unfreeze, Update Metadata (Coming Soon), Change Tax Settings (requires Token-2022), and Withdraw Fees (requires Token-2022).
- **Token Dashboard**: Provides an overview of all deployed tokens across chains, with real-time status updates, contract addresses, and block explorer links.
- **Security Features**: Client-side transaction signing, wallet-based deployment, secure token amount calculations using BigInt, and robust error handling.
- **Network Management**: Features a manual network switcher, network fee displays, and automatic network validation/switching.

### System Design Choices
- **Client-Side Deployment**: All transaction signing occurs client-side for security.
- **In-Memory Storage**: Token metadata is currently stored in-memory, with future plans for persistent storage.
- **Server-Side Contract Compilation**: Smart contracts are compiled on the server using `solc` to provide ABIs and bytecode.
- **Blockchain-Specific Architecture**: Independent, dedicated pages for each blockchain simplify network selection and user experience.
- **Real-time Polling**: Implemented for continuous updates on token deployment status.

## External Dependencies
- **Frontend Libraries**: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter, TanStack Query.
- **Backend Libraries**: Express.js, Node.js.
- **Web3 Libraries**: ethers.js, @solana/web3.js, @solana/spl-token, @metaplex-foundation/js.
- **Wallet Integrations**: MetaMask, Phantom, OKX Wallet, Solflare, Backpack.
- **Blockchain Networks**: Ethereum, Binance Smart Chain (BSC), Polygon, Arbitrum, Base, Solana.
- **Development Tools**: `solc` (Solidity compiler).