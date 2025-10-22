import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, bigint, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Blockchain types
export type BlockchainType = "EVM" | "Solana";
export type NetworkType = "mainnet" | "testnet" | "devnet";

// Blockchain networks configuration
export const SUPPORTED_CHAINS = {
  // Ethereum Mainnet
  "ethereum-mainnet": {
    name: "Ethereum Mainnet",
    chainId: 1,
    symbol: "ETH",
    color: "120 100% 35%",
    blockchainType: "EVM" as BlockchainType,
    networkType: "mainnet" as NetworkType,
    explorerUrl: "https://etherscan.io",
  },
  // Ethereum Testnet (Sepolia)
  "ethereum-testnet": {
    name: "Ethereum Sepolia",
    chainId: 11155111,
    symbol: "SepoliaETH",
    color: "120 100% 45%",
    blockchainType: "EVM" as BlockchainType,
    networkType: "testnet" as NetworkType,
    explorerUrl: "https://sepolia.etherscan.io",
  },
  // BSC Mainnet
  "bsc-mainnet": {
    name: "BNB Smart Chain",
    chainId: 56,
    symbol: "BNB",
    color: "30 100% 50%",
    blockchainType: "EVM" as BlockchainType,
    networkType: "mainnet" as NetworkType,
    explorerUrl: "https://bscscan.com",
  },
  // BSC Testnet
  "bsc-testnet": {
    name: "BNB Testnet",
    chainId: 97,
    symbol: "tBNB",
    color: "30 100% 60%",
    blockchainType: "EVM" as BlockchainType,
    networkType: "testnet" as NetworkType,
    explorerUrl: "https://testnet.bscscan.com",
  },
  // Polygon Mainnet
  "polygon-mainnet": {
    name: "Polygon",
    chainId: 137,
    symbol: "MATIC",
    color: "270 70% 55%",
    blockchainType: "EVM" as BlockchainType,
    networkType: "mainnet" as NetworkType,
    explorerUrl: "https://polygonscan.com",
  },
  // Polygon Testnet (Amoy)
  "polygon-testnet": {
    name: "Polygon Amoy",
    chainId: 80002,
    symbol: "MATIC",
    color: "270 70% 65%",
    blockchainType: "EVM" as BlockchainType,
    networkType: "testnet" as NetworkType,
    explorerUrl: "https://amoy.polygonscan.com",
  },
  // Arbitrum Mainnet
  "arbitrum-mainnet": {
    name: "Arbitrum One",
    chainId: 42161,
    symbol: "ETH",
    color: "210 100% 55%",
    blockchainType: "EVM" as BlockchainType,
    networkType: "mainnet" as NetworkType,
    explorerUrl: "https://arbiscan.io",
  },
  // Arbitrum Testnet (Sepolia)
  "arbitrum-testnet": {
    name: "Arbitrum Sepolia",
    chainId: 421614,
    symbol: "ETH",
    color: "210 100% 65%",
    blockchainType: "EVM" as BlockchainType,
    networkType: "testnet" as NetworkType,
    explorerUrl: "https://sepolia.arbiscan.io",
  },
  // Base Mainnet
  "base-mainnet": {
    name: "Base",
    chainId: 8453,
    symbol: "ETH",
    color: "210 100% 60%",
    blockchainType: "EVM" as BlockchainType,
    networkType: "mainnet" as NetworkType,
    explorerUrl: "https://basescan.org",
  },
  // Base Testnet (Sepolia)
  "base-testnet": {
    name: "Base Sepolia",
    chainId: 84532,
    symbol: "ETH",
    color: "210 100% 70%",
    blockchainType: "EVM" as BlockchainType,
    networkType: "testnet" as NetworkType,
    explorerUrl: "https://sepolia.basescan.org",
  },
  // Solana Devnet
  "solana-devnet": {
    name: "Solana Devnet",
    chainId: 0,
    symbol: "SOL",
    color: "280 100% 60%",
    blockchainType: "Solana" as BlockchainType,
    networkType: "devnet" as NetworkType,
    explorerUrl: "https://explorer.solana.com/?cluster=devnet",
  },
  // Solana Testnet
  "solana-testnet": {
    name: "Solana Testnet",
    chainId: 0,
    symbol: "SOL",
    color: "280 100% 55%",
    blockchainType: "Solana" as BlockchainType,
    networkType: "testnet" as NetworkType,
    explorerUrl: "https://explorer.solana.com/?cluster=testnet",
  },
  // Solana Mainnet
  "solana-mainnet": {
    name: "Solana Mainnet",
    chainId: 0,
    symbol: "SOL",
    color: "280 100% 50%",
    blockchainType: "Solana" as BlockchainType,
    networkType: "mainnet" as NetworkType,
    explorerUrl: "https://explorer.solana.com",
  },
} as const;

export type ChainId = keyof typeof SUPPORTED_CHAINS;

// Token types for EVM chains
export const EVM_TOKEN_TYPES = {
  standard: {
    name: "Standard ERC20",
    description: "Basic token with transfer functionality",
    features: ["Transfer", "Balance tracking"],
  },
  mintable: {
    name: "Mintable",
    description: "Owner can create new tokens",
    features: ["Transfer", "Balance tracking", "Minting"],
  },
  burnable: {
    name: "Burnable",
    description: "Holders can destroy their tokens",
    features: ["Transfer", "Balance tracking", "Burning"],
  },
  taxable: {
    name: "Taxable",
    description: "Tax on transfers to treasury wallet",
    features: ["Transfer", "Balance tracking", "Tax mechanism", "Treasury"],
  },
} as const;

// Token types for Solana
export const SOLANA_TOKEN_TYPES = {
  standard: {
    name: "SPL Token",
    description: "Standard Solana token",
    features: ["Transfer", "Balance tracking"],
  },
  mintable: {
    name: "SPL Token (Mintable)",
    description: "Token with mint authority",
    features: ["Transfer", "Balance tracking", "Minting"],
  },
} as const;

export type EvmTokenType = keyof typeof EVM_TOKEN_TYPES;
export type SolanaTokenType = keyof typeof SOLANA_TOKEN_TYPES;
export type TokenType = EvmTokenType | SolanaTokenType;

// Deployed tokens table
export const deployedTokens = pgTable("deployed_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  decimals: integer("decimals").notNull().default(18),
  totalSupply: text("total_supply").notNull(),
  tokenType: text("token_type").notNull(),
  chainId: text("chain_id").notNull(),
  contractAddress: text("contract_address"),
  deployerAddress: text("deployer_address").notNull(),
  transactionHash: text("transaction_hash"),
  status: text("status").notNull().default("pending"),
  
  // EVM specific fields
  taxPercentage: integer("tax_percentage"),
  treasuryWallet: text("treasury_wallet"),
  
  // Solana specific fields
  mintAuthority: text("mint_authority"),
  freezeAuthority: text("freeze_authority"),
  updateAuthority: text("update_authority"),
  
  // Token metadata
  logoUrl: text("logo_url"),
  description: text("description"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deployedAt: timestamp("deployed_at"),
});

export const insertDeployedTokenSchema = createInsertSchema(deployedTokens).omit({
  id: true,
  createdAt: true,
});

export type InsertDeployedToken = z.infer<typeof insertDeployedTokenSchema>;
export type DeployedToken = typeof deployedTokens.$inferSelect;

// Token deployment request schema for EVM chains
export const evmTokenCreationSchema = z.object({
  name: z.string().min(1, "Token name is required").max(50, "Token name too long"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long").toUpperCase(),
  decimals: z.number().int().min(0).max(18).default(18),
  totalSupply: z.string().min(1, "Total supply is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Total supply must be a positive number"),
  tokenType: z.enum(["standard", "mintable", "burnable", "taxable"]),
  chainId: z.enum([
    "ethereum-mainnet",
    "ethereum-testnet",
    "bsc-mainnet",
    "bsc-testnet",
    "polygon-mainnet",
    "polygon-testnet",
    "arbitrum-mainnet",
    "arbitrum-testnet",
    "base-mainnet",
    "base-testnet",
  ]),
  taxPercentage: z.number().int().min(0).max(25).optional(),
  treasuryWallet: z.string().optional(),
  logoUrl: z.string().url().optional(),
  description: z.string().max(500).optional(),
});

// Token deployment request schema for Solana
export const solanaTokenCreationSchema = z.object({
  name: z.string().min(1, "Token name is required").max(32, "Token name too long"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long").toUpperCase(),
  decimals: z.number().int().min(0).max(9).default(9),
  totalSupply: z.string().refine((val) => {
    if (val.trim() === '' || val.trim() === '0') return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Total supply must be a number or 0 for unlimited supply"),
  chainId: z.enum(["solana-devnet", "solana-testnet", "solana-mainnet"]),
  description: z.string().max(200, "Description too long").optional(),
  logoUrl: z.string().url().optional(),
  enableMintAuthority: z.boolean().default(false),
  enableFreezeAuthority: z.boolean().default(false),
});

// Unified token creation schema
export const tokenCreationSchema = z.discriminatedUnion("blockchainType", [
  z.object({
    blockchainType: z.literal("EVM"),
  }).merge(evmTokenCreationSchema),
  z.object({
    blockchainType: z.literal("Solana"),
  }).merge(solanaTokenCreationSchema),
]);

export type EvmTokenCreationForm = z.infer<typeof evmTokenCreationSchema>;
export type SolanaTokenCreationForm = z.infer<typeof solanaTokenCreationSchema>;
export type TokenCreationForm = z.infer<typeof tokenCreationSchema>;

// RPC configuration schema
export const rpcConfigSchema = z.object({
  // Ethereum
  ethereumMainnet: z.string().url().optional(),
  ethereumTestnet: z.string().url().optional(),
  // BSC
  bscMainnet: z.string().url().optional(),
  bscTestnet: z.string().url().optional(),
  // Other EVM chains
  polygonMainnet: z.string().url().optional(),
  arbitrumMainnet: z.string().url().optional(),
  baseMainnet: z.string().url().optional(),
  // Solana
  solanaDevnet: z.string().url().optional(),
  solanaTestnet: z.string().url().optional(),
  solanaMainnet: z.string().url().optional(),
});

export type RpcConfig = z.infer<typeof rpcConfigSchema>;
