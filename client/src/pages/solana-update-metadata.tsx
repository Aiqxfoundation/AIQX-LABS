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
import { Image, Loader2 } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { WalletRequired } from '@/components/WalletRequired';

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

  const handleUpdate = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      const { Metaplex, walletAdapterIdentity } = await import('@metaplex-foundation/js');

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

      const mintPublicKey = new PublicKey(mintAddress);
      const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });

      const updateData: any = {};
      if (name) updateData.name = name;
      if (symbol) updateData.symbol = symbol;
      if (uri) updateData.uri = uri;

      await metaplex.nfts().update({
        nftOrSft: nft,
        ...updateData,
      });

      toast({
        title: 'Metadata updated!',
        description: 'Token metadata has been successfully updated.',
      });

      setMintAddress('');
      setName('');
      setSymbol('');
      setUri('');
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
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

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-cyan-500" />
                Update Token Metadata
              </CardTitle>
              <CardDescription>
                Leave fields empty to keep current values
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symbol">New Token Symbol</Label>
                <Input
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Enter new token symbol (optional)"
                  data-testid="input-symbol"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uri">New Metadata URI</Label>
                <Input
                  id="uri"
                  value={uri}
                  onChange={(e) => setUri(e.target.value)}
                  placeholder="Enter new metadata URI (optional)"
                  data-testid="input-uri"
                />
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
