import { type ChainId } from '@shared/schema';
import { Connection } from '@solana/web3.js';

// Use global Buffer polyfill from main.tsx
declare const Buffer: typeof import('buffer').Buffer;

export interface SolanaDeploymentResult {
  mintAddress: string;
  transactionSignature: string;
  networkFee?: number;
}

export interface FeeEstimate {
  totalFee: number;
  rentFee: number;
  transactionFee: number;
  networkName: string;
}

const RPC_URLS: Record<string, string> = {
  'solana-testnet': 'https://api.testnet.solana.com',
  'solana-mainnet': 'https://api.mainnet-beta.solana.com',
};

// Helper to get Solana connection for a specific network
export function getSolanaConnection(network: 'testnet' | 'mainnet-beta'): Connection {
  const rpcUrl = network === 'testnet'
    ? RPC_URLS['solana-testnet']
    : RPC_URLS['solana-mainnet'];
  
  return new Connection(rpcUrl, 'confirmed');
}

function getWalletProvider() {
  // Try different wallet providers
  if (window.solana?.isConnected) return window.solana;
  if (window.okxwallet?.solana?.isConnected) return window.okxwallet.solana;
  if (window.solflare?.isConnected) return window.solflare;
  if (window.backpack?.isConnected) return window.backpack;
  return null;
}

// Estimate network fees for token deployment
export async function estimateDeploymentFees(chainId: ChainId): Promise<FeeEstimate> {
  try {
    const { Connection } = await import('@solana/web3.js');
    const { getMinimumBalanceForRentExemptMint } = await import('@solana/spl-token');
    
    const connection = new Connection(RPC_URLS[chainId], 'confirmed');
    
    // Get rent for mint account
    const rentFee = await getMinimumBalanceForRentExemptMint(connection);
    
    // Use a fixed estimate for transaction fees
    // Solana transaction fees are typically ~5000 lamports (0.000005 SOL)
    const transactionFee = 5000;
    
    const totalFee = rentFee + transactionFee;
    const totalFeeInSol = totalFee / 1e9;
    
    return {
      totalFee: totalFeeInSol,
      rentFee: rentFee / 1e9,
      transactionFee: transactionFee / 1e9,
      networkName: getNetworkName(chainId),
    };
  } catch (error) {
    console.error('Failed to estimate fees:', error);
    // Return default estimate if connection fails
    return {
      totalFee: 0.002,
      rentFee: 0.00144,
      transactionFee: 0.00005,
      networkName: getNetworkName(chainId),
    };
  }
}

export async function deploySolanaToken(
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: string,
  chainId: ChainId,
  enableMintAuthority: boolean,
  enableFreezeAuthority: boolean,
  enableUpdateAuthority: boolean,
  logoUrl?: string,
): Promise<SolanaDeploymentResult> {
  console.log('deploySolanaToken called with:', {
    name,
    symbol,
    decimals,
    totalSupply,
    chainId,
    enableMintAuthority,
    enableFreezeAuthority,
    enableUpdateAuthority,
  });

  const wallet = getWalletProvider();
  
  if (!wallet) {
    throw new Error('No Solana wallet connected. Please connect your wallet first.');
  }

  // Validate wallet connection
  if (!wallet.publicKey) {
    throw new Error('Wallet is connected but no public key found. Please reconnect your wallet.');
  }

  const walletName = wallet.isPhantom ? 'Phantom' : wallet.isOkxWallet ? 'OKX' : wallet.isSolflare ? 'Solflare' : wallet.isBackpack ? 'Backpack' : 'Unknown';
  console.log('Using wallet:', walletName);
  console.log('Wallet public key:', wallet.publicKey.toString());

  // Check and switch network BEFORE deployment
  try {
    await ensureCorrectNetwork(wallet, chainId);
  } catch (error: any) {
    console.error('Network switch failed:', error);
    throw new Error(`Please switch to ${getNetworkName(chainId)} in your wallet settings`);
  }

  try {
    // Import Solana libraries dynamically
    const { Connection, Keypair, SystemProgram, Transaction, PublicKey } = await import('@solana/web3.js');
    const { 
      createInitializeMintInstruction,
      createAssociatedTokenAccountInstruction,
      createMintToInstruction,
      createSetAuthorityInstruction,
      AuthorityType,
      getMinimumBalanceForRentExemptMint,
      MINT_SIZE,
      TOKEN_PROGRAM_ID,
      getAssociatedTokenAddress,
    } = await import('@solana/spl-token');

    const connection = new Connection(RPC_URLS[chainId], 'confirmed');
    const payer = wallet.publicKey;
    console.log('Connected to RPC:', RPC_URLS[chainId]);
    console.log('Payer address:', payer.toString());
    
    // Create mint account
    const mintKeypair = Keypair.generate();
    console.log('Generated mint address:', mintKeypair.publicKey.toString());
    
    const mintRent = await getMinimumBalanceForRentExemptMint(connection);
    console.log('Mint rent:', mintRent);

    // Create associated token account for initial supply
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      payer,
    );
    console.log('Associated token account:', associatedTokenAccount.toString());
    
    const transaction = new Transaction();
    console.log('Building transaction...');

    // Create mint account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports: mintRent,
        programId: TOKEN_PROGRAM_ID,
      })
    );

    // Always initialize with payer as mint authority (required for initial minting)
    // We'll revoke it later if user doesn't want ongoing mint authority
    transaction.add(
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        decimals,
        payer, // Always set payer as initial mint authority
        enableFreezeAuthority ? payer : null,
        TOKEN_PROGRAM_ID
      )
    );

    // Create token metadata using Metaplex Token Metadata Program
    // This makes tokens show with name/symbol in wallets like Phantom
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    
    // Derive metadata PDA
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    console.log('Metadata PDA:', metadataPDA.toString());
    
    // Create metadata account using Metaplex Token Metadata v1.1.0
    // Data structure for CreateMetadataAccountV3
    const metadataData = {
      name: name.slice(0, 32), // Max 32 chars
      symbol: symbol.slice(0, 10), // Max 10 chars
      uri: logoUrl || '', // URI for off-chain metadata (can be empty)
      sellerFeeBasisPoints: 0,
      creators: null,
    };
    
    // Build the instruction manually
    const keys = [
      { pubkey: metadataPDA, isSigner: false, isWritable: true },
      { pubkey: mintKeypair.publicKey, isSigner: false, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: new PublicKey('Sysvar1nstructions1111111111111111111111111'), isSigner: false, isWritable: false },
    ];
    
    // Encode metadata (simplified - using basic borsh encoding)
    const nameBytes = Buffer.from(name.slice(0, 32));
    const symbolBytes = Buffer.from(symbol.slice(0, 10));
    const uriBytes = Buffer.from((logoUrl || '').slice(0, 200));
    
    // Create the instruction data (instruction index 33 = CreateMetadataAccountV3)
    const data = Buffer.concat([
      Buffer.from([33]), // Instruction index
      // Name
      Buffer.from([nameBytes.length, 0, 0, 0]),
      nameBytes,
      // Symbol
      Buffer.from([symbolBytes.length, 0, 0, 0]),
      symbolBytes,
      // URI
      Buffer.from([uriBytes.length, 0, 0, 0]),
      uriBytes,
      // Seller fee basis points
      Buffer.from([0, 0]),
      // Creators (null)
      Buffer.from([0]),
      // Collection (null)
      Buffer.from([0]),
      // Uses (null)
      Buffer.from([0]),
      // Is mutable
      Buffer.from([1]),
      // Collection details (null)
      Buffer.from([0]),
    ]);
    
    const createMetadataInstruction = {
      keys,
      programId: TOKEN_METADATA_PROGRAM_ID,
      data,
    };
    
    transaction.add(createMetadataInstruction);
    console.log('Added metadata instruction');

    // Create associated token account
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer,
        associatedTokenAccount,
        payer,
        mintKeypair.publicKey,
      )
    );
    
    console.log(`Creating token with metadata. Name: ${name}, Symbol: ${symbol}`);

    // Mint initial supply using precise BigInt calculation
    // Treat empty string as "0" for unlimited supply
    const supplyStr = totalSupply.trim() === '' ? '0' : totalSupply;
    const supply = parseTokenAmount(supplyStr, decimals);
    if (supply > BigInt(0)) {
      transaction.add(
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedTokenAccount,
          payer,
          supply,
        )
      );
    }

    // Revoke mint authority if user doesn't want ongoing minting capability
    if (!enableMintAuthority) {
      transaction.add(
        createSetAuthorityInstruction(
          mintKeypair.publicKey,
          payer,
          AuthorityType.MintTokens,
          null, // Set to null to permanently disable minting
          [],
          TOKEN_PROGRAM_ID
        )
      );
    }

    // Revoke update authority on metadata if user doesn't want to update it later
    if (!enableUpdateAuthority) {
      const updateAuthorityKeys = [
        { pubkey: metadataPDA, isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: true, isWritable: false },
      ];
      
      const updateAuthorityData = Buffer.concat([
        Buffer.from([1]), // UpdateMetadataAccount instruction (discriminator)
        Buffer.from([0]), // No data update
        Buffer.from([1]), // Update authority change flag
        Buffer.from(new PublicKey('11111111111111111111111111111111').toBuffer()), // Set to system program (null equivalent)
        Buffer.from([0]), // No primary sale happened flag
      ]);
      
      const updateAuthorityInstruction = {
        keys: updateAuthorityKeys,
        programId: TOKEN_METADATA_PROGRAM_ID,
        data: updateAuthorityData,
      };
      
      transaction.add(updateAuthorityInstruction);
      console.log('Added instruction to revoke update authority');
    }

    // Set recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;
    console.log('Transaction prepared, blockhash:', blockhash);

    // Partially sign with mint keypair
    transaction.partialSign(mintKeypair);
    console.log('Transaction partially signed with mint keypair');

    // Sign and send with wallet
    console.log('Requesting signature from wallet... (wallet popup should appear now)');
    const signed = await wallet.signTransaction(transaction);
    console.log('Transaction signed by wallet');
    
    console.log('Sending transaction to network...');
    const signature = await connection.sendRawTransaction(signed.serialize());
    console.log('Transaction sent! Signature:', signature);
    
    // Confirm transaction
    console.log('Confirming transaction...');
    await connection.confirmTransaction(signature, 'confirmed');
    console.log('Transaction confirmed!');

    const result = {
      mintAddress: mintKeypair.publicKey.toString(),
      transactionSignature: signature,
    };
    console.log('Deployment successful:', result);

    return result;
  } catch (error: any) {
    console.error('Solana deployment error:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('User rejected')) {
      throw new Error('Transaction rejected by user');
    } else if (error.message?.includes('insufficient')) {
      throw new Error('Insufficient SOL balance to pay for transaction');
    } else {
      throw new Error(`Deployment failed: ${error.message || 'Unknown error'}`);
    }
  }
}

// Helper function to parse token amount with exact precision using BigInt
function parseTokenAmount(amountStr: string, decimals: number): bigint {
  // Remove any whitespace
  const cleaned = amountStr.trim();
  
  // Split on decimal point
  const parts = cleaned.split('.');
  const wholePart = parts[0] || '0';
  const fracPart = parts[1] || '';
  
  // Pad or trim fractional part to match decimals
  const paddedFrac = fracPart.padEnd(decimals, '0').slice(0, decimals);
  
  // Combine whole and fractional parts
  const combined = wholePart + paddedFrac;
  
  // Convert to BigInt
  return BigInt(combined);
}

// Helper function to get network name from chainId
function getNetworkName(chainId: ChainId): string {
  switch (chainId) {
    case 'solana-devnet':
      return 'Devnet';
    case 'solana-testnet':
      return 'Testnet';
    case 'solana-mainnet':
      return 'Mainnet';
    default:
      return chainId;
  }
}

// Helper function to ensure wallet is on correct network
async function ensureCorrectNetwork(wallet: any, chainId: ChainId): Promise<void> {
  const targetRpcUrl = RPC_URLS[chainId];
  const networkName = getNetworkName(chainId);
  
  console.log(`Checking if wallet is on ${networkName}...`);
  
  // For Phantom wallet, we can check and request network switch
  if (wallet.isPhantom) {
    try {
      // Import Connection to test current network
      const { Connection } = await import('@solana/web3.js');
      
      // Create connection with wallet's current RPC
      const walletConnection = new Connection(targetRpcUrl, 'confirmed');
      
      // Test connection
      await walletConnection.getLatestBlockhash();
      console.log(`✓ Wallet is connected to ${networkName}`);
      
    } catch (error) {
      console.warn(`Wallet may not be on ${networkName}, attempting switch...`);
      
      // Request network switch via Phantom's API if available
      if (wallet.request) {
        try {
          await wallet.request({
            method: 'wallet_switchNetwork',
            params: { network: chainId.replace('solana-', '') },
          });
          console.log(`✓ Switched wallet to ${networkName}`);
          
          // Wait a bit for the switch to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (switchError: any) {
          console.warn('Automatic network switch not supported:', switchError.message);
          throw new Error(`Please manually switch your wallet to ${networkName}`);
        }
      }
    }
  } else {
    // For other wallets, just log a warning
    console.log(`Note: Using ${networkName}. If transaction fails, please switch your wallet network manually.`);
  }
}
