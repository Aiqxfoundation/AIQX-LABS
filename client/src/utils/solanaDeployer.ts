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
    const { Connection, Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } = await import('@solana/web3.js');
    const { 
      createInitializeMintInstruction,
      createAssociatedTokenAccountInstruction,
      createMintToInstruction,
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

    // Initialize mint
    transaction.add(
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        decimals,
        enableMintAuthority ? payer : null,
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

    // Mint initial supply
    const supply = BigInt(parseFloat(totalSupply) * Math.pow(10, decimals));
    if (supply > 0) {
      transaction.add(
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedTokenAccount,
          payer,
          supply,
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
