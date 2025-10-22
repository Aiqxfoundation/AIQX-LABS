import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { tokenCreationSchema, SUPPORTED_CHAINS, type ChainId } from "@shared/schema";
import { compileContract, getContractNameForType } from "./utils/contract-compiler";
import { deployTokenContract, estimateGasCost } from "./utils/deployer";
import { ethers } from "ethers";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/tokens/deploy", async (req, res) => {
    try {
      const validatedData = tokenCreationSchema.parse(req.body);
      const { deployerAddress, privateKey } = req.body;

      if (!deployerAddress) {
        return res.status(400).json({ error: "Deployer address is required" });
      }

      // Handle EVM tokens
      if (validatedData.blockchainType === "EVM") {
        const constructorArgs = validatedData.tokenType === "taxable"
          ? [
              validatedData.name,
              validatedData.symbol,
              validatedData.decimals,
              validatedData.totalSupply,
              validatedData.taxPercentage || 5,
              validatedData.treasuryWallet || deployerAddress,
            ]
          : [
              validatedData.name,
              validatedData.symbol,
              validatedData.decimals,
              validatedData.totalSupply,
            ];

        const token = await storage.createDeployedToken({
          name: validatedData.name,
          symbol: validatedData.symbol,
          decimals: validatedData.decimals,
          totalSupply: validatedData.totalSupply,
          tokenType: validatedData.tokenType,
          chainId: validatedData.chainId,
          deployerAddress,
          status: "pending",
          contractAddress: null,
          transactionHash: null,
          taxPercentage: validatedData.taxPercentage || null,
          treasuryWallet: validatedData.treasuryWallet || null,
          logoUrl: validatedData.logoUrl || null,
          description: validatedData.description || null,
          mintAuthority: null,
          freezeAuthority: null,
          updateAuthority: null,
          deployedAt: null,
        });

        (async () => {
          try {
            const result = await deployTokenContract(
              validatedData.tokenType,
              constructorArgs,
              {
                privateKey,
                rpcUrl: "",
                chainId: validatedData.chainId,
              }
            );

            await storage.updateDeployedToken(token.id, {
              status: "deployed",
              contractAddress: result.contractAddress,
              transactionHash: result.transactionHash,
              deployedAt: new Date(),
            });
          } catch (error: any) {
            console.error("Deployment failed:", error);
            await storage.updateDeployedToken(token.id, {
              status: "failed",
            });
          }
        })();

        res.json(token);
      }
      // Handle Solana tokens
      else if (validatedData.blockchainType === "Solana") {
        const token = await storage.createDeployedToken({
          name: validatedData.name,
          symbol: validatedData.symbol,
          decimals: validatedData.decimals,
          totalSupply: validatedData.totalSupply,
          tokenType: validatedData.tokenType,
          chainId: validatedData.chainId,
          deployerAddress,
          status: "pending",
          contractAddress: null,
          transactionHash: null,
          taxPercentage: null,
          treasuryWallet: null,
          mintAuthority: validatedData.enableMintAuthority ? deployerAddress : null,
          freezeAuthority: validatedData.enableFreezeAuthority ? deployerAddress : null,
          updateAuthority: deployerAddress,
          logoUrl: validatedData.logoUrl || null,
          description: validatedData.description || null,
          deployedAt: null,
        });

        // TODO: Implement Solana token deployment
        (async () => {
          try {
            // Placeholder for Solana deployment
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            await storage.updateDeployedToken(token.id, {
              status: "deployed",
              contractAddress: "Coming soon: Solana deployment",
              transactionHash: "0x0",
              deployedAt: new Date(),
            });
          } catch (error: any) {
            console.error("Deployment failed:", error);
            await storage.updateDeployedToken(token.id, {
              status: "failed",
            });
          }
        })();

        res.json(token);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/tokens", async (req, res) => {
    try {
      const tokens = await storage.getDeployedTokens();
      res.json(tokens);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tokens/:id", async (req, res) => {
    try {
      const token = await storage.getDeployedTokenById(req.params.id);
      if (!token) {
        return res.status(404).json({ error: "Token not found" });
      }
      res.json(token);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tokens/:id/status", async (req, res) => {
    try {
      const { status, contractAddress, transactionHash } = req.body;
      const token = await storage.updateDeployedToken(req.params.id, {
        status,
        contractAddress,
        transactionHash,
        deployedAt: status === "deployed" ? new Date() : undefined,
      });

      if (!token) {
        return res.status(404).json({ error: "Token not found" });
      }

      res.json(token);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/contracts/compile/:tokenType", async (req, res) => {
    try {
      const { tokenType } = req.params;
      const contractName = getContractNameForType(tokenType);
      const compiled = compileContract(contractName, []);
      
      res.json({
        abi: compiled.abi,
        bytecode: compiled.bytecode,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/gas/estimate", async (req, res) => {
    try {
      const validatedData = tokenCreationSchema.parse(req.body);
      const { deployerAddress } = req.body;

      // Only EVM chains need gas estimation
      if (validatedData.blockchainType === "EVM") {
        const constructorArgs = validatedData.tokenType === "taxable"
          ? [
              validatedData.name,
              validatedData.symbol,
              validatedData.decimals,
              validatedData.totalSupply,
              validatedData.taxPercentage || 5,
              validatedData.treasuryWallet || deployerAddress,
            ]
          : [
              validatedData.name,
              validatedData.symbol,
              validatedData.decimals,
              validatedData.totalSupply,
            ];

        const estimate = await estimateGasCost(
          validatedData.tokenType,
          constructorArgs,
          validatedData.chainId
        );

        res.json({
          gasLimit: estimate.gasLimit.toString(),
          gasPrice: estimate.gasPrice.toString(),
          estimatedCost: estimate.estimatedCost,
          symbol: SUPPORTED_CHAINS[validatedData.chainId].symbol,
        });
      } else {
        // Solana transactions have fixed rent-exempt costs
        res.json({
          estimatedCost: "0.002",
          symbol: "SOL",
          note: "Approximate cost for token creation + metadata",
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
