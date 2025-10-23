# AIQX Labs - Multi-Chain Token Creation Platform

## Overview
AIQX Labs is a professional Web3 token creation platform designed for creating, deploying, and managing custom ERC20 and SPL tokens across multiple blockchains. The platform provides a modern, intuitive user interface with dedicated blockchain-specific branding, enabling users to easily launch tokens on chains like Ethereum, BSC, Polygon, Arbitrum, Base, and Solana. The platform now includes a comprehensive Solana Tools page with advanced token management features including multisender, authority transfers, minting, burning, and freeze/unfreeze capabilities. The business vision is to become a leading, secure, and user-friendly platform in the Web3 token creation market.

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
- **Solana Tools (Advanced)**: Comprehensive token management dashboard with 9 advanced features:
  - **Multisender**: Send tokens to multiple addresses in a single transaction
  - **Transfer Authority**: Transfer mint or freeze authority to another wallet
  - **Revoke Authority**: Permanently revoke mint or freeze authority
  - **Mint Tokens**: Mint additional tokens to any wallet (requires mint authority)
  - **Burn Tokens**: Permanently burn tokens from wallet
  - **Freeze/Unfreeze**: Freeze or unfreeze token accounts (requires freeze authority)
  - **Update Metadata**: Update token metadata (Coming Soon)
  - **Change Tax Settings**: Requires Token-2022 with Transfer Fee extension
  - **Withdraw Fees**: Requires Token-2022 with Transfer Fee extension
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
- **Web3 Libraries**: ethers.js (for EVM chains), @solana/web3.js, @solana/spl-token (for Solana), @metaplex-foundation/js (for Solana metadata).
- **Wallet Integrations**: MetaMask (for EVM), Phantom, OKX Wallet, Solflare, Backpack (for Solana).
- **Blockchain Networks**: Ethereum, Binance Smart Chain (BSC), Polygon, Arbitrum, Base, Solana (Devnet, Testnet, Mainnet-Beta).
- **Development Tools**: `solc` (Solidity compiler).

## Recent Updates (October 23, 2025)
### Solana Tools Page - Advanced Token Management
- **NEW PAGE**: `/tools-solana` - Comprehensive dashboard with 9 advanced token management tools
- **Multisender Tool**: Batch send tokens to multiple addresses in one transaction with CSV input
- **Authority Transfer**: Transfer mint or freeze authority to another wallet address
- **Authority Revocation**: Permanently revoke mint or freeze authority (irreversible)
- **Token Minting**: Mint additional tokens to any wallet (requires active mint authority)
- **Token Burning**: Permanently destroy tokens from connected wallet
- **Freeze/Unfreeze**: Freeze or unfreeze specific token accounts (requires freeze authority)
- **Advanced Features**: Tax settings and fee withdrawal noted as requiring Token-2022
- **Network Support**: Full support for Devnet, Testnet, and Mainnet-Beta
- **UX Features**: Purple/pink Solana-themed gradient, dialog modals, form validation, loading states
- **Navigation**: Added "Solana Tools" link to main navigation bar

### Buffer Polyfill Enhancement
- **FIXED**: Improved Buffer polyfill in index.html for better browser compatibility
- **Inline Implementation**: Self-contained Buffer class with TextEncoder/TextDecoder support
- **Methods**: from(), concat(), toString(), toJSON() implemented
- **Result**: All Solana SPL Token operations work correctly in browser environment