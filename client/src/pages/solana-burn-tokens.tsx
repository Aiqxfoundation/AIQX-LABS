import { useState } from 'react';
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

type SolanaNetwork = 'devnet' | 'testnet' | 'mainnet-beta';

export default function SolanaBurnTokens() {
  const { publicKey, isConnected, signTransaction } = useSolanaWallet();
  const { toast } = useToast();
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [decimals, setDecimals] = useState('9');

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
    <MainLayout>
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
              disabled={loading || !isConnected || !mintAddress || !amount}
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

            {!isConnected && (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Connect your wallet first
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
