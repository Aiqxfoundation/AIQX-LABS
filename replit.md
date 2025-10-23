# AIQX Labs - Multi-Chain Token Creation Platform

## Overview
AIQX Labs is a professional Web3 token creation platform with a completely redesigned UI/UX inspired by tools.smithii.io. The platform features dedicated chain-specific hubs for Ethereum, BSC, Polygon, Arbitrum, Base, and Solana, each with their own branded pages and clearly separated tools. Users can easily discover and access token creation, management, and advanced tools for each blockchain through an intuitive tab-based interface. The business vision is to become a leading, secure, and user-friendly platform in the Web3 token creation market.

## User Preferences
- Default theme: Dark mode
- Real-time token status polling every 5 seconds
- Responsive design for mobile, tablet, desktop
- Professional blockchain-themed visual design
- Separate pages per blockchain for better UX

## System Architecture
### UI/UX Decisions (October 2025 - Complete Redesign)
The platform underwent a major professional redesign inspired by tools.smithii.io, with a focus on clarity and blockchain separation. Key design principles:
- **Chain-Specific Hubs**: Each blockchain (Ethereum, BSC, Polygon, Arbitrum, Base, Solana) has a dedicated hub with branded gradient header and distinct color scheme
- **Tab-Based Navigation**: Four-tab structure per chain: Overview, Create Token, Manage Tokens, Advanced Tools
- **Home Page Redesign**: Clean blockchain selector grid showing all 6 supported chains with tool count badges
- **Professional Navigation**: Top navigation with "Blockchains" dropdown menu for quick chain switching
- **Glassmorphism & Cards**: Modern card-based layouts with shadows, hover effects, and clear visual hierarchy
- **Chain Branding**: Each chain has unique gradient (Ethereum: blue, BSC: yellow/amber, Polygon: purple, Arbitrum: cyan, Base: blue, Solana: purple-pink)
- **Tool Discovery**: Clear tool grids showing available and coming soon features per blockchain
- **Responsive Design**: Mobile-first approach with adaptive layouts
- Typography: Inter for primary text, JetBrains Mono for code/addresses. Shadcn UI components with Tailwind CSS.

### Technical Implementations
The frontend is built with React, TypeScript, and Wouter for routing. State management is handled by TanStack Query. The backend uses Express.js and Node.js. Web3 integration is managed by ethers.js for EVM chains and @solana/web3.js and @solana/spl-token for Solana. Key features include client-side transaction signing for security (no private keys on server), multi-wallet support for Solana (Phantom, OKX Wallet, Solflare, Backpack), and MetaMask integration for EVM chains. Token creation forms include comprehensive validation and real-time network fee estimations. Token types supported are Standard, Mintable, Burnable, and Taxable (EVM only).

### Feature Specifications
- **Multi-Chain Support**: Dedicated pages for Ethereum, BSC, Polygon, Arbitrum, Base (mainnet + testnet), and Solana (Devnet, Testnet, Mainnet-beta), each with official logos and chain-specific visual indicators.
- **EVM Multisender Tool**: Batch send tokens to multiple addresses across all EVM chains:
  - CSV file import or manual address/amount input (format: address,amount per line)
  - **Real-time validation**: Inline address validation using ethers.isAddress(), amount validation (positive numbers), format checking
  - **Balance checking**: Pre-execution balance verification to prevent insufficient fund errors
  - **Error reporting**: Line-by-line validation errors with clear descriptions
  - Sequential transaction execution with progress tracking
  - Success/failure reporting with transaction signatures
  - Works with any ERC20 token via MetaMask
  - Support for custom token decimals and amounts
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

### Professional UI Refinement - Typography & Collapsible Sidebar (October 23, 2025 - Phase 4) ✅ COMPLETE
- **COLLAPSIBLE SIDEBAR**: Added smooth toggle functionality with no layout shift when collapsed/expanded
- **PROFESSIONAL TYPOGRAPHY**: Comprehensive font size reduction across all pages for cleaner, more professional look:
  - Main headings reduced from text-4xl to text-xl
  - Descriptions reduced from text-lg to text-sm
  - Tool cards updated with smaller, refined text sizes (text-sm for titles, text-xs for descriptions)
  - Improved visual hierarchy and readability
- **DESIGN TOKENS**: Replaced hard-coded slate colors with proper CSS design tokens (background, border, accent)
- **COMPACT SPACING**: Reduced padding and margins throughout for tighter, more efficient layouts:
  - Card padding reduced from p-8 to p-4/p-6
  - Header sections reduced from p-8 to p-6
  - Gap spacing optimized from gap-6 to gap-4
- **SIDEBAR IMPROVEMENTS**:
  - Added collapse toggle button with smooth transitions
  - Fixed layout shift issue - content area properly handles sidebar width changes
  - Refined sidebar typography (smaller font sizes, better spacing)
  - Professional hover states and active indicators
- **BUG FIXES**:
  - Fixed double navigation issue (conditional rendering in App.tsx)
  - Fixed LSP error in create-solana.tsx (network parameter type validation)
  - Updated all oversized headings and text across chain-overview, create-solana, tools-evm pages
- **RESPONSIVE DESIGN**: All changes maintain responsive behavior across desktop, tablet, and mobile

### Professional Sidebar Navigation Redesign (October 23, 2025 - Phase 3) ✅ COMPLETE
- **MAJOR UI/UX UPGRADE**: Completely redesigned navigation inspired by tools.smithii.io professional standards
- **Sidebar Navigation**: Implemented persistent left sidebar with blockchain icons and tool categories
- **Professional Layout**: Replaced tab-based navigation with sidebar + main content area for cleaner UX
- **Blockchain Selector**: Left sidebar shows all 6 blockchains with icons, names, and tool count badges
- **Tool Categories**: Dynamic tools section in sidebar displays available tools for selected blockchain
- **Icon System**: Professional icon usage from lucide-react throughout the interface
- **Clean Theme**: Removed excessive gradients, improved spacing, better contrast and readability
- **Consistent Navigation**: All chain pages (overview, create, manage, tools) use unified MainLayout component
- **Dashboard Integration**: Quick access to dashboard from sidebar footer
- **Responsive Design**: Sidebar navigation works across all device sizes
- **Brand Identity**: Each blockchain maintains its unique color scheme and branding
- **Smart Navigation**: Conditional rendering - sidebar for chain pages, top nav for home/dashboard

## Recent Updates (October 23, 2025)

### Major Feature Upgrade - Multisender & Advanced Tools (October 23, 2025 - Phase 2) ✅ COMPLETE
- **MULTISENDER PRODUCTION READY**: Fully functional multisender tool across all 5 EVM chains (Ethereum, BSC, Polygon, Arbitrum, Base)
- **Comprehensive Validation**: Real-time address validation (ethers.isAddress), amount validation, format checking, and BigInt-based balance verification
- **EVM Tools Page**: Created unified `/chain/{chainId}/tools` advanced tools page for all EVM chains with chain-specific branding
- **Batch Token Transfers**: CSV import support with line-by-line error reporting and sequential transaction execution
- **Progress Tracking**: Real-time transaction tracking with success/failure reporting per recipient
- **Token Locker UI**: Created professional Token Locker UI framework (marked "Coming Soon" pending smart contract deployment)
- **Tool Count Update**: EVM chains now show 3 available tools (Token Creator, Multisender, Manage Tokens), 1 coming soon (Token Locker)
- **Precision Fix**: BigInt arithmetic prevents floating-point rounding errors in balance calculations
- **Chain Configs Updated**: All multisender feature flags set to `true`, routes updated to new tools pages
- **Architect Approved**: Passed comprehensive code review with security verification

### Complete UI/UX Redesign - Professional Multi-Chain Platform
- **MAJOR REDESIGN**: Complete platform overhaul inspired by tools.smithii.io for professional look
- **Chain Hubs**: Created dedicated chain-specific pages with `/chain/{chainId}` routing structure
- **ChainLayout Component**: Professional tabbed interface with branded headers for each blockchain
- **Home Page**: Redesigned with blockchain selector grid, feature highlights, and stats section
- **Navigation**: New dropdown "Blockchains" menu for easy chain switching
- **Chain Overview Pages**: Show all available tools, stats, and quick actions per blockchain
- **Wrapped Pages**: All create/manage/tools pages now use consistent ChainLayout component
- **Tool Visibility**: Clear indication of available tools vs. coming soon features
- **Professional Styling**: Glassmorphism cards, gradient headers, hover effects, and modern spacing
- **Chain Branding**: Each blockchain has unique color gradients and branded visual identity
- **CHAIN_DEFINITIONS Config**: Centralized blockchain metadata driving routing, themes, and features


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

### Logo Fixes - Official Blockchain Branding
- **FIXED**: Solana, Arbitrum, and Base now display their official logos instead of ETH logo
- **Implementation**: Using `react-icons/si` for Ethereum, BSC, Polygon, Solana (SiSolana), and Base (SiCoinbase)
- **Custom SVG**: Created official Arbitrum logo (hexagon with "A") as custom SVG component
- **Result**: All 6 blockchains now have distinct, recognizable official branding

### Buffer Polyfill Enhancement
- **FIXED**: Improved Buffer polyfill in index.html for better browser compatibility
- **Inline Implementation**: Self-contained Buffer class with TextEncoder/TextDecoder support
- **Methods**: from(), concat(), toString(), toJSON() implemented
- **Result**: All Solana SPL Token operations work correctly in browser environment