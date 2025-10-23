import { 
  Connection, 
  PublicKey, 
  Transaction,
} from '@solana/web3.js';
import {
  getMint,
  AuthorityType,
  setAuthority,
} from '@solana/spl-token';

export interface TokenAuthorities {
  mintAuthority: string | null;
  freezeAuthority: string | null;
}

/**
 * Get the current authorities for a token
 */
export async function getTokenAuthorities(
  connection: Connection,
  mintAddress: string
): Promise<TokenAuthorities> {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    const mintInfo = await getMint(connection, mintPubkey);
    
    return {
      mintAuthority: mintInfo.mintAuthority?.toBase58() || null,
      freezeAuthority: mintInfo.freezeAuthority?.toBase58() || null,
    };
  } catch (error) {
    console.error('Error fetching token authorities:', error);
    throw new Error('Failed to fetch token authorities');
  }
}

/**
 * Revoke mint authority for a token
 * WARNING: This action is IRREVERSIBLE! Once revoked, you cannot mint more tokens.
 */
export async function revokeMintAuthority(
  connection: Connection,
  mintAddress: string,
  currentAuthority: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<string> {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    
    // Create transaction to revoke mint authority
    const transaction = new Transaction();
    
    // Create the setAuthority instruction
    const instruction = await setAuthority(
      connection,
      currentAuthority, // Payer
      mintPubkey,
      currentAuthority,
      AuthorityType.MintTokens,
      null, // Setting to null revokes the authority
    );
    
    transaction.add(instruction);
    
    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = currentAuthority;
    
    // Sign and send transaction
    const signedTx = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize());
    
    // Confirm transaction
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });
    
    console.log('Mint authority revoked. Signature:', signature);
    return signature;
  } catch (error) {
    console.error('Error revoking mint authority:', error);
    throw new Error('Failed to revoke mint authority: ' + (error as Error).message);
  }
}

/**
 * Revoke freeze authority for a token
 * WARNING: This action is IRREVERSIBLE! Once revoked, you cannot freeze/unfreeze accounts.
 */
export async function revokeFreezeAuthority(
  connection: Connection,
  mintAddress: string,
  currentAuthority: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<string> {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    
    // Create transaction to revoke freeze authority
    const transaction = new Transaction();
    
    // Create the setAuthority instruction
    const instruction = await setAuthority(
      connection,
      currentAuthority, // Payer
      mintPubkey,
      currentAuthority,
      AuthorityType.FreezeAccount,
      null, // Setting to null revokes the authority
    );
    
    transaction.add(instruction);
    
    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = currentAuthority;
    
    // Sign and send transaction
    const signedTx = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize());
    
    // Confirm transaction
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });
    
    console.log('Freeze authority revoked. Signature:', signature);
    return signature;
  } catch (error) {
    console.error('Error revoking freeze authority:', error);
    throw new Error('Failed to revoke freeze authority: ' + (error as Error).message);
  }
}

/**
 * Check if the connected wallet is the authority for a token
 */
export function isWalletAuthority(
  walletAddress: string | null,
  authorityAddress: string | null
): boolean {
  if (!walletAddress || !authorityAddress) return false;
  return walletAddress === authorityAddress;
}
