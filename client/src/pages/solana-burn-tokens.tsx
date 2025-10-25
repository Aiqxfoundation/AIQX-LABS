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
import { Flame, Loader2, AlertTriangle } from 'lucide-react';
import { burnTokens } from '@/utils/solanaTools';
import MainLayout from '@/components/MainLayout';
import { WalletRequired } from '@/components/WalletRequired';

type SolanaNetwork = 'testnet' | 'mainnet-beta';

interface TokenAccount {
  mintAddress: string;
  balance: string;
  decimals: number;
}

export default function SolanaBurnTokens() {
  const { publicKey, isConnected, signTransaction } = useSolanaWallet();
  const { toast } = useToast();
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [loading, setLoading] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
  const [mintAddress, setMintAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [decimals, setDecimals] = useState('9');

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

  const handleBurn = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      const signature = await burnTokens(
        connection,
        new PublicKey(publicKey),
        mintAddress,
        parseFloat(amount),
        parseInt(decimals),
        signTransaction
      );

      toast({
        title: 'Tokens burned!',
        description: `Burned ${amount} tokens. Signature: ${signature.slice(0, 8)}...`,
      });

      setMintAddress('');
      setAmount('');
    } catch (error: any) {
      toast({
        title: 'Burn failed',
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Burn Tokens
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Permanently destroy tokens from your wallet
          </p>
        </div>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-cyan-500" />
              Burn Tokens
            </CardTitle>
            <CardDescription>
              This action is permanent and cannot be undone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-1">
                    Warning: Tokens will be permanently destroyed
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    Burned tokens are removed from circulation forever and cannot be recovered.
                  </p>
                </div>
              </div>
            </div>

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
                <Label>Select Token from Wallet *</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadTokenAccounts}
                  disabled={loadingTokens || !isConnected}
                  data-testid="button-load-tokens"
                >
                  {loadingTokens ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Refresh Tokens'
                  )}
                </Button>
              </div>
              <Select value={mintAddress} onValueChange={setMintAddress}>
                <SelectTrigger data-testid="select-token">
                  <SelectValue placeholder={loadingTokens ? "Loading tokens..." : tokenAccounts.length === 0 ? "No tokens found - connect wallet and refresh" : "Select a token from your wallet"} />
                </SelectTrigger>
                <SelectContent>
                  {tokenAccounts.map((token) => (
                    <SelectItem key={token.mintAddress} value={token.mintAddress}>
                      {token.mintAddress.slice(0, 8)}...{token.mintAddress.slice(-6)} (Balance: {token.balance})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Burn *</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to burn"
                data-testid="input-amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="decimals">Token Decimals</Label>
              <Input
                id="decimals"
                type="number"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
                placeholder="9"
                data-testid="input-decimals"
              />
            </div>

            <Button
              onClick={handleBurn}
              disabled={loading || !mintAddress || !amount}
              variant="destructive"
              className="w-full"
              data-testid="button-burn"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Burning...
                </>
              ) : (
                <>
                  <Flame className="mr-2 h-4 w-4" />
                  Burn Tokens
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
