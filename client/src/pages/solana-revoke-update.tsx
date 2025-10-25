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
import { ShieldX, Loader2, AlertTriangle } from 'lucide-react';
import { revokeUpdateAuthority } from '@/utils/solanaAuthority';
import MainLayout from '@/components/MainLayout';
import { WalletRequired } from '@/components/WalletRequired';

type SolanaNetwork = 'testnet' | 'mainnet-beta';

interface TokenAccount {
  mintAddress: string;
  balance: string;
  decimals: number;
}

export default function SolanaRevokeUpdate() {
  const { publicKey, isConnected, signTransaction } = useSolanaWallet();
  const { toast } = useToast();
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [loading, setLoading] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
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
          description: `Found ${tokens.length} token(s) in your wallet`,
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

  const handleRevoke = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      const signature = await revokeUpdateAuthority(
        connection,
        mintAddress,
        new PublicKey(publicKey),
        signTransaction
      );

      toast({
        title: 'Update authority revoked!',
        description: `Update authority permanently revoked. Signature: ${signature.slice(0, 8)}...`,
      });

      setMintAddress('');
    } catch (error: any) {
      toast({
        title: 'Revoke failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout currentChainId="solana">
      <WalletRequired 
        title="Wallet Connection Required"
        description="Connect your Solana wallet to use this tool"
      >
        <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldX className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">Revoke Update Authority</h1>
          </div>
          <p className="text-muted-foreground">
            Permanently revoke update authority to make token metadata immutable
          </p>
        </div>
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Revoke Update Authority</CardTitle>
              <CardDescription>
                This will permanently revoke your ability to update token metadata (name, symbol, logo).
                This action cannot be undone!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <Select
                  value={network}
                  onValueChange={(value) => setNetwork(value as SolanaNetwork)}
                  data-testid="select-network"
                >
                  <SelectTrigger id="network">
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
                  <Label htmlFor="mint">Token Mint Address</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadTokenAccounts}
                    disabled={!isConnected || loadingTokens}
                    data-testid="button-load-tokens"
                  >
                    {loadingTokens ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load My Tokens'
                    )}
                  </Button>
                </div>
                
                {tokenAccounts.length > 0 ? (
                  <Select
                    value={mintAddress}
                    onValueChange={setMintAddress}
                    data-testid="select-mint"
                  >
                    <SelectTrigger id="mint">
                      <SelectValue placeholder="Select a token from your wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokenAccounts.map((token) => (
                        <SelectItem key={token.mintAddress} value={token.mintAddress}>
                          {token.mintAddress.slice(0, 8)}...{token.mintAddress.slice(-8)} ({token.balance})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="mint"
                    placeholder="Enter token mint address"
                    value={mintAddress}
                    onChange={(e) => setMintAddress(e.target.value)}
                    data-testid="input-mint"
                  />
                )}
              </div>

              <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="font-medium text-orange-500">Warning: Irreversible Action</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Once update authority is revoked, you CANNOT update token metadata</li>
                      <li>The token name, symbol, and logo will be permanently locked</li>
                      <li>This action cannot be undone or reversed</li>
                      <li>Only revoke if you're certain you won't need to update metadata</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleRevoke}
                disabled={!mintAddress || loading}
                className="w-full"
                variant="destructive"
                data-testid="button-revoke"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Revoking...
                  </>
                ) : (
                  <>
                    <ShieldX className="mr-2 h-4 w-4" />
                    Revoke Update Authority
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
