import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { Metaplex, irysStorage, walletAdapterIdentity } from '@metaplex-foundation/js';
import { Buffer } from 'buffer';

export interface TokenMetadata {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
}

export interface MetadataUpdateResult {
  signature: string;
  metadataUri?: string;
}

/**
 * Upload image file to decentralized storage (Irys)
 */
export async function uploadImageToIrys(
  network: 'testnet' | 'mainnet-beta',
  imageBuffer: ArrayBuffer | Uint8Array,
  fileName: string,
  contentType: string,
  connection: Connection,
  authority: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<string> {
  const bufferSize = imageBuffer instanceof ArrayBuffer ? imageBuffer.byteLength : imageBuffer.length;
  console.log('Uploading image to Irys...', { size: bufferSize, contentType });
  
  const walletAdapter = {
    publicKey: authority,
    signTransaction,
    signAllTransactions: async (txs: Transaction[]) => {
      return Promise.all(txs.map(tx => signTransaction(tx)));
    },
  };
  
  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(walletAdapter))
    .use(irysStorage({
      address: network === 'mainnet-beta' 
        ? 'https://node1.irys.xyz' 
        : 'https://node2.irys.xyz',
      timeout: 90000,
    }));
  
  const buffer = Buffer.from(imageBuffer);
  const imageFile = {
    buffer,
    fileName,
    displayName: fileName,
    uniqueName: `${Date.now()}-${fileName}`,
    contentType,
    extension: fileName.split('.').pop() || contentType.split('/')[1] || 'png',
    tags: [{ name: 'Content-Type', value: contentType }],
  };
  
  const uri = await metaplex.storage().upload(imageFile);
  console.log('Image uploaded successfully:', uri);
  return uri;
}

/**
 * Upload metadata JSON to decentralized storage (Irys)
 */
export async function uploadMetadataToIrys(
  network: 'testnet' | 'mainnet-beta',
  metadata: TokenMetadata,
  connection: Connection,
  authority: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<string> {
  console.log('Uploading metadata JSON to Irys...');
  
  const walletAdapter = {
    publicKey: authority,
    signTransaction,
    signAllTransactions: async (txs: Transaction[]) => {
      return Promise.all(txs.map(tx => signTransaction(tx)));
    },
  };
  
  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(walletAdapter))
    .use(irysStorage({
      address: network === 'mainnet-beta' 
        ? 'https://node1.irys.xyz' 
        : 'https://node2.irys.xyz',
      timeout: 90000,
    }));

  const metadataJson = {
    name: metadata.name,
    symbol: metadata.symbol,
    description: metadata.description || `${metadata.name} (${metadata.symbol}) Token`,
    image: metadata.image || '',
    attributes: [],
    properties: {
      files: metadata.image ? [
        {
          uri: metadata.image,
          type: 'image/png',
        }
      ] : [],
      category: 'image',
    },
  };

  const uri = await metaplex.storage().uploadJson(metadataJson);
  console.log('Metadata uploaded successfully:', uri);
  return uri;
}

/**
 * Update token metadata on-chain using Metaplex Token Metadata standard
 */
export async function updateTokenMetadata(
  connection: Connection,
  authority: PublicKey,
  mintAddress: string,
  name: string,
  symbol: string,
  metadataUri: string,
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>
): Promise<MetadataUpdateResult> {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    console.log('Updating on-chain metadata for mint:', mintAddress);
    console.log('Update details:', { name, symbol, uri: metadataUri });
    
    // Create wallet adapter for Metaplex
    const walletAdapter = {
      publicKey: authority,
      signTransaction: async (tx: Transaction) => {
        console.log('Signing transaction with wallet...');
        const signed = await signTransaction(tx);
        if (signed instanceof Transaction) {
          return signed;
        }
        throw new Error('Unexpected transaction type returned from wallet');
      },
      signAllTransactions: async (txs: Transaction[]) => {
        console.log(`Signing ${txs.length} transaction(s) with wallet...`);
        const signed = await Promise.all(txs.map(tx => signTransaction(tx)));
        return signed.map(tx => {
          if (tx instanceof Transaction) {
            return tx;
          }
          throw new Error('Unexpected transaction type returned from wallet');
        });
      },
    };
    
    const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
    
    // Find the current metadata account
    console.log('Fetching current metadata...');
    const nft = await metaplex.nfts().findByMint({ mintAddress: mintPubkey });
    
    if (!nft) {
      throw new Error('Token metadata account not found. This token may not have metadata.');
    }
    
    console.log('Current metadata found, updating...');
    
    // Update the metadata
    const { response } = await metaplex.nfts().update({
      nftOrSft: nft,
      name,
      symbol,
      uri: metadataUri,
    });
    
    console.log('Metadata updated successfully! Signature:', response.signature);
    
    return {
      signature: response.signature,
      metadataUri,
    };
  } catch (error: any) {
    console.error('Error updating metadata:', error);
    
    // Provide more helpful error messages
    if (error.message?.includes('User rejected') || error.message?.includes('rejected')) {
      throw new Error('Transaction was rejected in your wallet. Please try again and approve the transaction.');
    }
    
    if (error.message?.includes('Account does not exist') || error.message?.includes('not found')) {
      throw new Error('Token metadata account not found. Only tokens with metadata can be updated.');
    }
    
    if (error.message?.includes('insufficient') || error.message?.includes('balance')) {
      throw new Error('Insufficient SOL balance to pay for transaction fees. Please add SOL to your wallet.');
    }
    
    if (error.message?.includes('authority') || error.message?.includes('Authority')) {
      throw new Error('You are not the update authority for this token. Only the token creator can update metadata.');
    }
    
    throw new Error(`Failed to update metadata: ${error.message}`);
  }
}
