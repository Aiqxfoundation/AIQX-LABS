# AIQX Labs - Multi-Chain Token Creation Platform

## Overview
AIQX Labs is a professional Web3 token creation platform designed for creating, deploying, and managing custom ERC20 and SPL tokens across multiple blockchains. The platform aims to provide a modern, intuitive user interface with dedicated blockchain-specific branding, enabling users to easily launch tokens on chains like Ethereum, BSC, Polygon, Arbitrum, Base, and Solana. The business vision is to become a leading, secure, and user-friendly platform in the Web3 token creation market.

## User Preferences
- Default theme: Dark mode
- Real-time token status polling every 5 seconds
- Responsive design for mobile, tablet, desktop
- Professional blockchain-themed visual design
- Separate pages per blockchain for better UX

## System Architecture
### UI/UX Decisions
The platform features a modern UI inspired by 20lab.app, with a dark mode default theme and light mode support. Each blockchain has a dedicated page with specific branding, logos, color schemes (e.g., Ethereum: blue, BSC: yellow, Solana: purple-pink), and pre-configured network selections. The design incorporates custom wallet connect buttons and messaging per blockchain, and uses Inter for primary text and JetBrains Mono for code/addresses. Shadcn UI components and Tailwind CSS are used for styling.

### Technical Implementations
The frontend is built with React, TypeScript, and Wouter for routing. State management is handled by TanStack Query. The backend uses Express.js and Node.js. Web3 integration is managed by ethers.js for EVM chains and @solana/web3.js and @solana/spl-token for Solana. Key features include client-side transaction signing for security (no private keys on server), multi-wallet support for Solana (Phantom, OKX Wallet, Solflare, Backpack), and MetaMask integration for EVM chains. Token creation forms include comprehensive validation and real-time network fee estimations. Token types supported are Standard, Mintable, Burnable, and Taxable (EVM only).

### Feature Specifications
- **Multi-Chain Support**: Dedicated pages for Ethereum, BSC, Polygon, Arbitrum, Base (mainnet + testnet), and Solana (Devnet, Testnet, Mainnet-beta), each with official logos and chain-specific visual indicators.
- **Token Creation Flow**: Users select a blockchain, connect their wallet, fill out a validated form, and deploy the token via a wallet signature.
- **Token Management (Solana)**: Dedicated page to manage Solana token authorities post-deployment:
  - View all deployed SPL tokens by network (Devnet/Testnet/Mainnet)
  - Real-time authority status checking (Mint Authority, Freeze Authority)
  - Revoke authorities permanently with wallet signature
  - Warning dialogs explaining irreversibility of authority revocation
  - Explorer links for each token
- **Token Dashboard**: Allows users to view all deployed tokens across chains, with real-time status updates, contract addresses, and links to block explorers.
- **Security Features**: Client-side transaction signing, wallet-based deployment, secure token amount calculations using BigInt, and robust error handling.
- **Network Management**: Includes a manual network switcher with confirmation dialogs, network fee displays, and automatic network validation/switching before deployment.

### System Design Choices
- **Client-Side Deployment**: All transaction signing occurs client-side for maximum security, eliminating the need for private keys on the server.
- **In-Memory Storage**: For MVP, token metadata is stored in-memory, designed for future upgradeability to a persistent database like PostgreSQL.
- **Server-Side Contract Compilation**: Smart contracts are compiled on the server using `solc` to provide ABIs and bytecode to the frontend.
- **Blockchain-Specific Architecture**: A core decision to have independent, dedicated pages for each blockchain, simplifying network selection and user experience.
- **Real-time Polling**: Implemented for continuous updates on token deployment status.

## External Dependencies
- **Frontend Libraries**: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter, TanStack Query.
- **Backend Libraries**: Express.js, Node.js.
- **Web3 Libraries**: ethers.js (for EVM chains), @solana/web3.js, @solana/spl-token (for Solana).
- **Wallet Integrations**: MetaMask (for EVM), Phantom, OKX Wallet, Solflare, Backpack (for Solana).
- **Blockchain Networks**: Ethereum, Binance Smart Chain (BSC), Polygon, Arbitrum, Base, Solana.
- **Development Tools**: `solc` (Solidity compiler).