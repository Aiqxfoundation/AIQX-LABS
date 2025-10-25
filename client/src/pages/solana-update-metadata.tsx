import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { getSolanaConnection } from '@/utils/solanaDeployer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Image, Loader2, Info, RefreshCw, AlertTriangle } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';

type SolanaNetwork = 'testnet' | 'mainnet-beta';

interface TokenAccount {
  mintAddress: string;
  balance: string;
  decimals: number;
}

export default function SolanaUpdateMetadata() {
  const { publicKey, isConnected } = useSolanaWallet();
  const { toast } = useToast();
  
  const [network, setNetwork] = useState<SolanaNetwork>('testnet');
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [mintAddress, setMintAddress] = useState('');

  const loadTokenAccounts = async () => {
    if (!publicKey || !isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    setLoadingTokens(true);
    try {
      const connection = getSolanaConnection(network);
      const { TOKEN_PROGRAM_ID } = await import('@solana/spl-token');
      
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(publicKey),
        { programId: TOKEN_PROGRAM_ID }
      );

      const tokens: TokenAccount[] = tokenAccounts.value
        .filter(account => {
          const amount = account.account.data.parsed.info.tokenAmount;
          return amount.uiAmount && amount.uiAmount > 0;
        })
        .map(account => ({
          mintAddress: account.account.data.parsed.info.mint,
          balance: account.account.data.parsed.info.tokenAmount.uiAmountString,
          decimals: account.account.data.parsed.info.tokenAmount.decimals,
        }));

      setTokenAccounts(tokens);
      
      if (tokens.length === 0) {
        toast({
          title: 'No tokens found',
          description: 'No tokens found in your wallet on this network',
        });
      } else {
        toast({
          title: 'Tokens loaded',
          description: `Found ${tokens.length} token(s)`,
        });
      }
    } catch (error: any) {
      console.error('Error loading tokens:', error);
      toast({
        title: 'Failed to load tokens',
        description: error.message || 'Failed to fetch your token accounts',
        variant: 'destructive',
      });
    } finally {
      setLoadingTokens(false);
    }
  };

  useEffect(() => {
    if (isConnected && publicKey) {
      loadTokenAccounts();
    }
  }, [network, isConnected, publicKey]);

  return (
    <MainLayout currentChainId="solana">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Update Token Metadata
          </h1>
          <p className="text-gray-400">
            Update name, symbol, description, and image for your Solana tokens
          </p>
        </div>

        <Alert className="mb-6 border-yellow-500/20 bg-yellow-500/5">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-sm text-gray-300">
            <strong>Feature Under Reconstruction:</strong> The metadata update feature is being rebuilt with improved compatibility and stability. 
            In the meantime, you can update your token metadata manually using:
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Solana CLI:</strong> Use <code className="bg-gray-800 px-2 py-1 rounded text-xs">spl-token update-metadata</code> command</li>
              <li><strong>Metaplex Sugar:</strong> Use the Metaplex Sugar CLI tool for metadata updates</li>
              <li><strong>Solana Explorer:</strong> Visit Solana Explorer and use the metadata update feature</li>
            </ul>
          </AlertDescription>
        </Alert>

        {!isConnected ? (
          <Card className="border-cyan-500/20 bg-cyan-500/5">
            <CardContent className="pt-6">
              <Alert className="border-cyan-500/20 bg-transparent">
                <Info className="h-4 w-4 text-cyan-500" />
                <AlertDescription className="text-sm text-gray-300">
                  Connect your Solana wallet to view your tokens
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-cyan-500" />
                Your Tokens
              </CardTitle>
              <CardDescription>
                View tokens in your wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <Select value={network} onValueChange={(v) => setNetwork(v as SolanaNetwork)}>
                  <SelectTrigger id="network" data-testid="select-network">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="testnet">Testnet</SelectItem>
                    <SelectItem value="mainnet-beta">Mainnet Beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Your Tokens</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadTokenAccounts}
                    disabled={loadingTokens}
                    data-testid="button-refresh"
                  >
                    {loadingTokens ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </>
                    )}
                  </Button>
                </div>

                {tokenAccounts.length > 0 ? (
                  <div className="border border-gray-800 rounded-lg divide-y divide-gray-800">
                    {tokenAccounts.map((token) => (
                      <div key={token.mintAddress} className="p-4 hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono text-sm">{token.mintAddress}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Balance: {token.balance} | Decimals: {token.decimals}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-800 rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">
                      {loadingTokens ? 'Loading tokens...' : 'No tokens found in your wallet'}
                    </p>
                  </div>
                )}
              </div>

              <Alert className="border-cyan-500/20 bg-cyan-500/5">
                <Info className="h-4 w-4 text-cyan-500" />
                <AlertDescription className="text-xs text-gray-300">
                  <strong>Alternative Tools:</strong> For now, please use Solana CLI tools or Metaplex Sugar to update your token metadata. 
                  The rebuilt version will support direct metadata updates through this interface.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
