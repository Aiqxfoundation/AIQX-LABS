import { ethers } from 'ethers';
import { SUPPORTED_CHAINS, type ChainId } from '@shared/schema';

export interface EvmDeploymentResult {
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
}

export interface TokenFeatures {
  isMintable: boolean;
  isBurnable: boolean;
  isPausable: boolean;
  isCapped: boolean;
  hasTax: boolean;
  maxSupply?: string;
  taxPercentage?: number;
  treasuryWallet?: string;
}

export async function deployEvmToken(
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: string,
  chainId: ChainId,
  features: TokenFeatures
): Promise<EvmDeploymentResult> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  
  const targetChainId = SUPPORTED_CHAINS[chainId].chainId;
  if (Number(network.chainId) !== targetChainId) {
    throw new Error(`Please switch to ${SUPPORTED_CHAINS[chainId].name} in your wallet`);
  }

  // Determine contract type based on features
  const contractType = determineContractType(features);
  
  const response = await fetch(`/api/contracts/compile/${contractType}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contract compilation');
  }
  
  const { abi, bytecode } = await response.json();

  // Build constructor arguments based on features
  const constructorArgs = buildConstructorArgs(
    name,
    symbol,
    decimals,
    totalSupply,
    features,
    await signer.getAddress()
  );

  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const contract = await factory.deploy(...constructorArgs);
  
  await contract.waitForDeployment();
  
  const deploymentTx = contract.deploymentTransaction();
  if (!deploymentTx) {
    throw new Error('Deployment transaction not found');
  }

  const receipt = await deploymentTx.wait();
  if (!receipt) {
    throw new Error('Transaction receipt not found');
  }

  return {
    contractAddress: await contract.getAddress(),
    transactionHash: deploymentTx.hash,
    blockNumber: receipt.blockNumber,
  };
}

function determineContractType(features: TokenFeatures): string {
  // Build contract type based on combined features
  const featureList = [];
  if (features.isMintable) featureList.push('mintable');
  if (features.isBurnable) featureList.push('burnable');
  if (features.isPausable) featureList.push('pausable');
  if (features.isCapped) featureList.push('capped');
  if (features.hasTax) featureList.push('taxable');
  
  return featureList.length > 0 ? featureList.join('-') : 'standard';
}

function buildConstructorArgs(
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: string,
  features: TokenFeatures,
  signerAddress: string
): any[] {
  const baseArgs = [name, symbol, decimals, totalSupply];
  
  // Add feature-specific arguments in consistent order
  const additionalArgs = [];
  
  if (features.isCapped && features.maxSupply) {
    additionalArgs.push(features.maxSupply);
  }
  
  if (features.hasTax) {
    additionalArgs.push(features.taxPercentage || 5);
    additionalArgs.push(features.treasuryWallet || signerAddress);
  }
  
  return [...baseArgs, ...additionalArgs];
}
