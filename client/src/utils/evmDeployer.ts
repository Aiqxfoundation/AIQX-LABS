import { ethers } from 'ethers';
import { SUPPORTED_CHAINS, type ChainId, type EvmTokenType } from '@shared/schema';

export interface EvmDeploymentResult {
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
}

export async function deployEvmToken(
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: string,
  tokenType: EvmTokenType,
  chainId: ChainId,
  taxPercentage?: number,
  treasuryWallet?: string,
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

  const response = await fetch(`/api/contracts/compile/${tokenType}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contract compilation');
  }
  
  const { abi, bytecode } = await response.json();

  const constructorArgs = tokenType === 'taxable'
    ? [name, symbol, decimals, totalSupply, taxPercentage || 5, treasuryWallet || await signer.getAddress()]
    : [name, symbol, decimals, totalSupply];

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
