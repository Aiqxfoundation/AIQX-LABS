import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';

export interface TokenMetadata {
  name: string;
  symbol: string;
  uri: string;
}

export async function updateTokenMetadata(
  connection: Connection,
  authority: PublicKey,
  mintAddress: string,
  metadata: TokenMetadata,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<string> {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    
    // Create a wallet adapter for Metaplex
    const walletAdapter = {
      publicKey: authority,
      signTransaction,
      signAllTransactions: async (txs: Transaction[]) => {
        const signed = [];
        for (const tx of txs) {
          signed.push(await signTransaction(tx));
        }
        return signed;
      },
    };
    
    // Create Metaplex instance with wallet adapter
    const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
    
    // Get the current metadata account
    const nft = await metaplex.nfts().findByMint({ mintAddress: mintPubkey });
    
    if (!nft) {
      throw new Error('Token metadata not found. This token may not have metadata.');
    }

    // Update the metadata - only update fields that are provided
    const updateData: any = {
      nftOrSft: nft,
    };
    
    if (metadata.name) updateData.name = metadata.name;
    if (metadata.symbol) updateData.symbol = metadata.symbol;
    if (metadata.uri) updateData.uri = metadata.uri;

    // Update on-chain metadata
    const { response } = await metaplex.nfts().update(updateData);

    // Return the transaction signature
    return response.signature;
  } catch (error: any) {
    console.error('Error updating metadata:', error);
    throw new Error(`Failed to update metadata: ${error.message}`);
  }
}
