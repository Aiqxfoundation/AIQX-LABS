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

function getWalletProvider() {
  // Try different wallet providers
  if (window.solana?.isConnected) return window.solana;
  if (window.okxwallet?.solana?.isConnected) return window.okxwallet.solana;
  if (window.solflare?.isConnected) return window.solflare;
  if (window.backpack?.isConnected) return window.backpack;
  return null;
}

export async function deploySolanaToken(
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: string,
  chainId: ChainId,
  enableMintAuthority: boolean,
  enableFreezeAuthority: boolean,
): Promise<SolanaDeploymentResult> {
  console.log('deploySolanaToken called with:', {
    name,
    symbol,
    decimals,
    totalSupply,
    chainId,
    enableMintAuthority,
    enableFreezeAuthority,
  });

  const wallet = getWalletProvider();
  
  if (!wallet) {
    throw new Error('No Solana wallet connected. Please connect your wallet first.');
  }

  console.log('Using wallet:', wallet.isPhantom ? 'Phantom' : wallet.isOkxWallet ? 'OKX' : wallet.isSolflare ? 'Solflare' : wallet.isBackpack ? 'Backpack' : 'Unknown');

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

declare global {
  interface Window {
    solana?: any;
    okxwallet?: {
      solana?: any;
    };
    solflare?: any;
    backpack?: any;
  }
}
