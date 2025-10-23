import { SiEthereum, SiBinance, SiPolygon } from 'react-icons/si';
import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons';

export interface ChainTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  comingSoon?: boolean;
  route: string;
}

export interface ChainConfig {
  id: string;
  name: string;
  displayName: string;
  icon: IconType;
  color: string;
  gradient: string;
  network: string;
  explorer: string;
  routes: {
    overview: string;
    create: string;
    manage: string;
    tools: string;
  };
  tools: ChainTool[];
  features: {
    standardToken: boolean;
    mintableToken: boolean;
    burnableToken: boolean;
    taxableToken: boolean;
    multisender: boolean;
    authorityManagement: boolean;
    freezeAccounts: boolean;
    metadata: boolean;
  };
}

export const CHAIN_DEFINITIONS: Record<string, ChainConfig> = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    displayName: 'Ethereum',
    icon: SiEthereum,
    color: '#627EEA',
    gradient: 'from-blue-500 via-indigo-500 to-blue-600',
    network: 'Mainnet',
    explorer: 'https://etherscan.io',
    routes: {
      overview: '/chain/ethereum',
      create: '/chain/ethereum/create',
      manage: '/chain/ethereum/manage',
      tools: '/chain/ethereum/tools',
    },
    tools: [
      {
        id: 'token-creator',
        name: 'Token Creator',
        description: 'Create custom ERC20 tokens without coding',
        icon: 'Coins',
        available: true,
        route: '/chain/ethereum/create',
      },
      {
        id: 'multisender',
        name: 'Multisender',
        description: 'Send tokens to multiple addresses in one transaction',
        icon: 'Send',
        available: false,
        comingSoon: true,
        route: '/chain/ethereum/tools#multisender',
      },
      {
        id: 'token-locker',
        name: 'Token Locker',
        description: 'Lock tokens for a specific period of time',
        icon: 'Lock',
        available: false,
        comingSoon: true,
        route: '/chain/ethereum/tools#locker',
      },
      {
        id: 'manage-tokens',
        name: 'Manage Tokens',
        description: 'View and manage your deployed tokens',
        icon: 'Settings',
        available: true,
        route: '/chain/ethereum/manage',
      },
    ],
    features: {
      standardToken: true,
      mintableToken: true,
      burnableToken: true,
      taxableToken: true,
      multisender: false,
      authorityManagement: false,
      freezeAccounts: false,
      metadata: false,
    },
  },
  bsc: {
    id: 'bsc',
    name: 'BSC',
    displayName: 'Binance Smart Chain',
    icon: SiBinance,
    color: '#F3BA2F',
    gradient: 'from-yellow-400 via-yellow-500 to-amber-500',
    network: 'BSC Mainnet',
    explorer: 'https://bscscan.com',
    routes: {
      overview: '/chain/bsc',
      create: '/chain/bsc/create',
      manage: '/chain/bsc/manage',
      tools: '/chain/bsc/tools',
    },
    tools: [
      {
        id: 'token-creator',
        name: 'Token Creator',
        description: 'Create custom BEP20 tokens without coding',
        icon: 'Coins',
        available: true,
        route: '/chain/bsc/create',
      },
      {
        id: 'multisender',
        name: 'Multisender',
        description: 'Send tokens to multiple addresses in one transaction',
        icon: 'Send',
        available: false,
        comingSoon: true,
        route: '/chain/bsc/tools#multisender',
      },
      {
        id: 'token-locker',
        name: 'Token Locker',
        description: 'Lock tokens for a specific period of time',
        icon: 'Lock',
        available: false,
        comingSoon: true,
        route: '/chain/bsc/tools#locker',
      },
      {
        id: 'manage-tokens',
        name: 'Manage Tokens',
        description: 'View and manage your deployed tokens',
        icon: 'Settings',
        available: true,
        route: '/chain/bsc/manage',
      },
    ],
    features: {
      standardToken: true,
      mintableToken: true,
      burnableToken: true,
      taxableToken: true,
      multisender: false,
      authorityManagement: false,
      freezeAccounts: false,
      metadata: false,
    },
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    displayName: 'Polygon',
    icon: SiPolygon,
    color: '#8247E5',
    gradient: 'from-purple-500 via-purple-600 to-indigo-600',
    network: 'Polygon Mainnet',
    explorer: 'https://polygonscan.com',
    routes: {
      overview: '/chain/polygon',
      create: '/chain/polygon/create',
      manage: '/chain/polygon/manage',
      tools: '/chain/polygon/tools',
    },
    tools: [
      {
        id: 'token-creator',
        name: 'Token Creator',
        description: 'Create custom tokens on Polygon',
        icon: 'Coins',
        available: true,
        route: '/chain/polygon/create',
      },
      {
        id: 'multisender',
        name: 'Multisender',
        description: 'Send tokens to multiple addresses in one transaction',
        icon: 'Send',
        available: false,
        comingSoon: true,
        route: '/chain/polygon/tools#multisender',
      },
      {
        id: 'token-locker',
        name: 'Token Locker',
        description: 'Lock tokens for a specific period of time',
        icon: 'Lock',
        available: false,
        comingSoon: true,
        route: '/chain/polygon/tools#locker',
      },
      {
        id: 'manage-tokens',
        name: 'Manage Tokens',
        description: 'View and manage your deployed tokens',
        icon: 'Settings',
        available: true,
        route: '/chain/polygon/manage',
      },
    ],
    features: {
      standardToken: true,
      mintableToken: true,
      burnableToken: true,
      taxableToken: true,
      multisender: false,
      authorityManagement: false,
      freezeAccounts: false,
      metadata: false,
    },
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum',
    displayName: 'Arbitrum',
    icon: SiEthereum,
    color: '#28A0F0',
    gradient: 'from-blue-400 via-cyan-500 to-blue-500',
    network: 'Arbitrum One',
    explorer: 'https://arbiscan.io',
    routes: {
      overview: '/chain/arbitrum',
      create: '/chain/arbitrum/create',
      manage: '/chain/arbitrum/manage',
      tools: '/chain/arbitrum/tools',
    },
    tools: [
      {
        id: 'token-creator',
        name: 'Token Creator',
        description: 'Create custom tokens on Arbitrum',
        icon: 'Coins',
        available: true,
        route: '/chain/arbitrum/create',
      },
      {
        id: 'multisender',
        name: 'Multisender',
        description: 'Send tokens to multiple addresses in one transaction',
        icon: 'Send',
        available: false,
        comingSoon: true,
        route: '/chain/arbitrum/tools#multisender',
      },
      {
        id: 'token-locker',
        name: 'Token Locker',
        description: 'Lock tokens for a specific period of time',
        icon: 'Lock',
        available: false,
        comingSoon: true,
        route: '/chain/arbitrum/tools#locker',
      },
      {
        id: 'manage-tokens',
        name: 'Manage Tokens',
        description: 'View and manage your deployed tokens',
        icon: 'Settings',
        available: true,
        route: '/chain/arbitrum/manage',
      },
    ],
    features: {
      standardToken: true,
      mintableToken: true,
      burnableToken: true,
      taxableToken: true,
      multisender: false,
      authorityManagement: false,
      freezeAccounts: false,
      metadata: false,
    },
  },
  base: {
    id: 'base',
    name: 'Base',
    displayName: 'Base',
    icon: SiEthereum,
    color: '#0052FF',
    gradient: 'from-blue-600 via-blue-500 to-indigo-500',
    network: 'Base Mainnet',
    explorer: 'https://basescan.org',
    routes: {
      overview: '/chain/base',
      create: '/chain/base/create',
      manage: '/chain/base/manage',
      tools: '/chain/base/tools',
    },
    tools: [
      {
        id: 'token-creator',
        name: 'Token Creator',
        description: 'Create custom tokens on Base',
        icon: 'Coins',
        available: true,
        route: '/chain/base/create',
      },
      {
        id: 'multisender',
        name: 'Multisender',
        description: 'Send tokens to multiple addresses in one transaction',
        icon: 'Send',
        available: false,
        comingSoon: true,
        route: '/chain/base/tools#multisender',
      },
      {
        id: 'token-locker',
        name: 'Token Locker',
        description: 'Lock tokens for a specific period of time',
        icon: 'Lock',
        available: false,
        comingSoon: true,
        route: '/chain/base/tools#locker',
      },
      {
        id: 'manage-tokens',
        name: 'Manage Tokens',
        description: 'View and manage your deployed tokens',
        icon: 'Settings',
        available: true,
        route: '/chain/base/manage',
      },
    ],
    features: {
      standardToken: true,
      mintableToken: true,
      burnableToken: true,
      taxableToken: true,
      multisender: false,
      authorityManagement: false,
      freezeAccounts: false,
      metadata: false,
    },
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    displayName: 'Solana',
    icon: SiEthereum, // Will use custom SVG
    color: '#9945FF',
    gradient: 'from-purple-500 via-pink-500 to-purple-600',
    network: 'Mainnet Beta',
    explorer: 'https://explorer.solana.com',
    routes: {
      overview: '/chain/solana',
      create: '/chain/solana/create',
      manage: '/chain/solana/manage',
      tools: '/chain/solana/tools',
    },
    tools: [
      {
        id: 'token-creator',
        name: 'Token Creator',
        description: 'Create custom SPL tokens without coding',
        icon: 'Coins',
        available: true,
        route: '/chain/solana/create',
      },
      {
        id: 'multisender',
        name: 'Multisender',
        description: 'Send tokens to multiple addresses in one transaction',
        icon: 'Send',
        available: true,
        route: '/chain/solana/tools#multisender',
      },
      {
        id: 'authority-transfer',
        name: 'Transfer Authority',
        description: 'Transfer mint or freeze authority to another wallet',
        icon: 'UserPlus',
        available: true,
        route: '/chain/solana/tools#transfer-authority',
      },
      {
        id: 'authority-revoke',
        name: 'Revoke Authority',
        description: 'Permanently revoke mint or freeze authority',
        icon: 'UserX',
        available: true,
        route: '/chain/solana/tools#revoke-authority',
      },
      {
        id: 'mint-tokens',
        name: 'Mint Tokens',
        description: 'Mint additional tokens to any wallet',
        icon: 'Plus',
        available: true,
        route: '/chain/solana/tools#mint-tokens',
      },
      {
        id: 'burn-tokens',
        name: 'Burn Tokens',
        description: 'Permanently burn tokens from your wallet',
        icon: 'Flame',
        available: true,
        route: '/chain/solana/tools#burn-tokens',
      },
      {
        id: 'freeze-unfreeze',
        name: 'Freeze/Unfreeze',
        description: 'Freeze or unfreeze token accounts',
        icon: 'Snowflake',
        available: true,
        route: '/chain/solana/tools#freeze',
      },
      {
        id: 'manage-tokens',
        name: 'Manage Tokens',
        description: 'View and manage your deployed SPL tokens',
        icon: 'Settings',
        available: true,
        route: '/chain/solana/manage',
      },
    ],
    features: {
      standardToken: true,
      mintableToken: true,
      burnableToken: true,
      taxableToken: false,
      multisender: true,
      authorityManagement: true,
      freezeAccounts: true,
      metadata: true,
    },
  },
};

export const SUPPORTED_CHAINS = Object.values(CHAIN_DEFINITIONS);

export function getChainConfig(chainId: string): ChainConfig | undefined {
  return CHAIN_DEFINITIONS[chainId];
}
