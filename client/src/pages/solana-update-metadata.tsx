import { useState } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { getSolanaConnection } from '@/utils/solanaDeployer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Image, Loader2, Info, ExternalLink } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { WalletRequired } from '@/components/WalletRequired';
import { Alert, AlertDescription } from '@/components/ui/alert';

type SolanaNetwork = 'devnet' | 'testnet' | 'mainnet-beta';

export default function SolanaUpdateMetadata() {
  const { publicKey, isConnected, signTransaction } = useSolanaWallet();
  const { toast } = useToast();
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [uri, setUri] = useState('');

  const validateUri = (value: string): boolean => {
    if (!value) return true; // Empty is okay (means no update)
    
    // Must be a valid URL
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      toast({
        title: 'Invalid URI',
        description: 'Metadata URI must be a valid HTTP or HTTPS URL',
        variant: 'destructive',
      });
      return false;
    }
    
    // Must be under 200 characters per Metaplex spec
    if (value.length > 200) {
      toast({
        title: 'URI too long',
        description: 'Metadata URI must be under 200 characters',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  };

  const handleUpdate = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    if (!mintAddress || (!name && !symbol && !uri)) {
      toast({ 
        title: 'Missing information', 
        description: 'Please provide the mint address and at least one field to update',
        variant: 'destructive' 
      });
      return;
    }

    // Validate URI if provided
    if (uri && !validateUri(uri)) {
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      // Import Metaplex dynamically to avoid loading issues
      const { Metaplex, walletAdapterIdentity } = await import('@metaplex-foundation/js');

      // Create Metaplex instance with wallet adapter
      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity({
        publicKey: new PublicKey(publicKey),
        signTransaction: async (tx: Transaction) => {
          const signed = await signTransaction(tx);
          return signed;
        },
        signAllTransactions: async (txs: Transaction[]) => {
          const signed = await Promise.all(txs.map(tx => signTransaction(tx)));
          return signed;
        },
      }));

      // Get the token metadata
      const mintPublicKey = new PublicKey(mintAddress);
      const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });

      if (!nft) {
        throw new Error('Metadata not found for this token. The token may not have on-chain metadata.');
      }

      // Build update data - only include fields that are provided
      const updateData: any = {
        nftOrSft: nft,
      };
      
      if (name) updateData.name = name;
      if (symbol) updateData.symbol = symbol;
      if (uri) updateData.uri = uri;

      // Update the metadata
      const { response } = await metaplex.nfts().update(updateData);

      toast({
        title: 'Metadata updated!',
        description: `Token metadata has been successfully updated. Signature: ${response.signature.slice(0, 8)}...`,
      });

      setMintAddress('');
      setName('');
      setSymbol('');
      setUri('');
    } catch (error: any) {
      console.error('Update metadata error:', error);
      
      // Provide helpful error messages
      let errorMessage = error.message || 'Failed to update metadata';
      
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected in your wallet';
      } else if (error.message?.includes('Account does not exist')) {
        errorMessage = 'Token metadata account not found. Only tokens with metadata can be updated.';
      } else if (error.message?.includes('insufficient')) {
        errorMessage = 'Insufficient SOL balance to pay for transaction';
      } else if (error.message?.includes('authority')) {
        errorMessage = 'You are not the update authority for this token';
      }
      
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <WalletRequired 
        title="Wallet Connection Required"
        description="Connect your Solana wallet to update token metadata"
      >
        <div className="max-w-3xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Update Metadata
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update token name, symbol, or metadata URI
            </p>
          </div>

          <Alert className="mb-6 border-cyan-500/20 bg-cyan-500/5">
            <Info className="h-4 w-4 text-cyan-500" />
            <AlertDescription className="text-sm text-gray-300">
              <strong>Requirements:</strong> You must be the update authority for this token. The metadata URI must point to a valid JSON file hosted online (max 200 characters). Leave fields empty to keep current values.
            </AlertDescription>
          </Alert>

          <Alert className="mb-6 border-blue-500/20 bg-blue-500/5">
            <ExternalLink className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm text-gray-300">
              <strong>Image Hosting:</strong> Host your token image on a service like <a href="https://www.pinata.cloud/" target="_blank" rel="noopener noreferrer" className="underline">Pinata</a>, <a href="https://nft.storage/" target="_blank" rel="noopener noreferrer" className="underline">NFT.Storage</a>, or <a href="https://www.arweave.org/" target="_blank" rel="noopener noreferrer" className="underline">Arweave</a>, then create a JSON metadata file with the image URL and paste its link below.
            </AlertDescription>
          </Alert>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-cyan-500" />
                Update Token Metadata
              </CardTitle>
              <CardDescription>
                Modify your token's on-chain metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <Select value={network} onValueChange={(v) => setNetwork(v as SolanaNetwork)}>
                  <SelectTrigger id="network" data-testid="select-network">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="devnet">Devnet</SelectItem>
                    <SelectItem value="testnet">Testnet</SelectItem>
                    <SelectItem value="mainnet-beta">Mainnet Beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mint">Token Mint Address *</Label>
                <Input
                  id="mint"
                  value={mintAddress}
                  onChange={(e) => setMintAddress(e.target.value)}
                  placeholder="Enter token mint address"
                  data-testid="input-mint-address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">New Token Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter new token name (optional)"
                  data-testid="input-name"
                  maxLength={32}
                />
                <p className="text-xs text-muted-foreground">Maximum 32 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symbol">New Token Symbol</Label>
                <Input
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Enter new token symbol (optional)"
                  data-testid="input-symbol"
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground">Maximum 10 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="uri">Metadata URI (JSON File URL)</Label>
                <Input
                  id="uri"
                  type="url"
                  value={uri}
                  onChange={(e) => setUri(e.target.value)}
                  placeholder="https://example.com/metadata.json"
                  data-testid="input-uri"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  Must be a hosted JSON file with your token metadata (max 200 chars)
                </p>
              </div>

              <Button
                onClick={handleUpdate}
                disabled={loading || !mintAddress || (!name && !symbol && !uri)}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                data-testid="button-update"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Image className="mr-2 h-4 w-4" />
                    Update Metadata
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </WalletRequired>
    </MainLayout>
  );
}
