import { type DeployedToken, type InsertDeployedToken } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createDeployedToken(token: InsertDeployedToken): Promise<DeployedToken>;
  getDeployedTokens(): Promise<DeployedToken[]>;
  getDeployedTokenById(id: string): Promise<DeployedToken | undefined>;
  updateDeployedToken(id: string, updates: Partial<DeployedToken>): Promise<DeployedToken | undefined>;
}

export class MemStorage implements IStorage {
  private deployedTokens: Map<string, DeployedToken>;

  constructor() {
    this.deployedTokens = new Map();
  }

  async createDeployedToken(insertToken: InsertDeployedToken): Promise<DeployedToken> {
    const id = randomUUID();
    const token: DeployedToken = {
      id,
      name: insertToken.name,
      symbol: insertToken.symbol,
      decimals: insertToken.decimals ?? 18,
      totalSupply: insertToken.totalSupply,
      tokenType: insertToken.tokenType,
      chainId: insertToken.chainId,
      contractAddress: insertToken.contractAddress ? insertToken.contractAddress : null,
      deployerAddress: insertToken.deployerAddress,
      transactionHash: insertToken.transactionHash ?? null,
      status: insertToken.status,
      taxPercentage: insertToken.taxPercentage ?? null,
      treasuryWallet: insertToken.treasuryWallet ?? null,
      createdAt: new Date(),
      deployedAt: insertToken.deployedAt ?? null,
    };
    this.deployedTokens.set(id, token);
    return token;
  }

  async getDeployedTokens(): Promise<DeployedToken[]> {
    return Array.from(this.deployedTokens.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getDeployedTokenById(id: string): Promise<DeployedToken | undefined> {
    return this.deployedTokens.get(id);
  }

  async updateDeployedToken(
    id: string,
    updates: Partial<DeployedToken>
  ): Promise<DeployedToken | undefined> {
    const token = this.deployedTokens.get(id);
    if (!token) return undefined;

    const updatedToken = { ...token, ...updates };
    this.deployedTokens.set(id, updatedToken);
    return updatedToken;
  }
}

export const storage = new MemStorage();
