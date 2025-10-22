import { type ChainId } from '@shared/schema';

export interface SolanaDeploymentResult {
  mintAddress: string;
  transactionSignature: string;
}

const RPC_URLS: Record<string, string> = {
  'solana-devnet': 'https://api.devnet.solana.com',
  'solana-testnet': 'https://api.testnet.solana.com',
  'solana-mainnet': 'https://api.mainnet-beta.solana.com',
};

export async function deploySolanaToken(
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: string,
  chainId: ChainId,
  enableMintAuthority: boolean,
  enableFreezeAuthority: boolean,
): Promise<SolanaDeploymentResult> {
  if (!window.solana || !window.solana.isPhantom) {
    throw new Error('Phantom wallet not installed');
  }

  if (!window.solana.isConnected) {
    throw new Error('Wallet not connected');
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
    const payer = window.solana.publicKey;
    
    // Create mint account
    const mintKeypair = Keypair.generate();
    const mintRent = await getMinimumBalanceForRentExemptMint(connection);

    // Create associated token account for initial supply
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      payer,
    );

    const transaction = new Transaction();

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

    // Create associated token account
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer,
        associatedTokenAccount,
        payer,
        mintKeypair.publicKey,
      )
    );

    // Mint initial supply using precise BigInt calculation
    const supply = parseTokenAmount(totalSupply, decimals);
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

    // Set recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    // Partially sign with mint keypair
    transaction.partialSign(mintKeypair);

    // Sign and send with Phantom
    const signed = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    // Confirm transaction
    await connection.confirmTransaction(signature, 'confirmed');

    return {
      mintAddress: mintKeypair.publicKey.toString(),
      transactionSignature: signature,
    };
  } catch (error: any) {
    console.error('Solana deployment error:', error);
    throw new Error(`Solana deployment failed: ${error.message}`);
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
