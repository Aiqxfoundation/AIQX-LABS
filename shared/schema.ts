import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, bigint, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Blockchain networks configuration
export const SUPPORTED_CHAINS = {
  ethereum: {
    name: "Ethereum",
    chainId: 1,
    symbol: "ETH",
    color: "120 100% 35%",
    rpcUrl: "",
  },
  bsc: {
    name: "BNB Smart Chain",
    chainId: 56,
    symbol: "BNB",
    color: "30 100% 50%",
    rpcUrl: "",
  },
  polygon: {
    name: "Polygon",
    chainId: 137,
    symbol: "MATIC",
    color: "270 70% 55%",
    rpcUrl: "",
  },
  arbitrum: {
    name: "Arbitrum",
    chainId: 42161,
    symbol: "ETH",
    color: "210 100% 55%",
    rpcUrl: "",
  },
  base: {
    name: "Base",
    chainId: 8453,
    symbol: "ETH",
    color: "210 100% 60%",
    rpcUrl: "",
  },
} as const;

export type ChainId = keyof typeof SUPPORTED_CHAINS;

// Token types
export const TOKEN_TYPES = {
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

export type TokenType = keyof typeof TOKEN_TYPES;

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
  taxPercentage: integer("tax_percentage"),
  treasuryWallet: text("treasury_wallet"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deployedAt: timestamp("deployed_at"),
});

export const insertDeployedTokenSchema = createInsertSchema(deployedTokens).omit({
  id: true,
  createdAt: true,
});

export type InsertDeployedToken = z.infer<typeof insertDeployedTokenSchema>;
export type DeployedToken = typeof deployedTokens.$inferSelect;

// Token deployment request schema for frontend forms
export const tokenCreationSchema = z.object({
  name: z.string().min(1, "Token name is required").max(50, "Token name too long"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long").toUpperCase(),
  decimals: z.number().int().min(0).max(18).default(18),
  totalSupply: z.string().min(1, "Total supply is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Total supply must be a positive number"),
  tokenType: z.enum(["standard", "mintable", "burnable", "taxable"]),
  chainId: z.enum(["ethereum", "bsc", "polygon", "arbitrum", "base"]),
  taxPercentage: z.number().int().min(0).max(25).optional(),
  treasuryWallet: z.string().optional(),
});

export type TokenCreationForm = z.infer<typeof tokenCreationSchema>;

// RPC configuration schema
export const rpcConfigSchema = z.object({
  ethereum: z.string().url().optional(),
  bsc: z.string().url().optional(),
  polygon: z.string().url().optional(),
  arbitrum: z.string().url().optional(),
  base: z.string().url().optional(),
});

export type RpcConfig = z.infer<typeof rpcConfigSchema>;
