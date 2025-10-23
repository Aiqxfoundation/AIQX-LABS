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
import { Plus, Loader2 } from 'lucide-react';
import { mintTokens } from '@/utils/solanaTools';
import MainLayout from '@/components/MainLayout';

type SolanaNetwork = 'devnet' | 'testnet' | 'mainnet-beta';

export default function SolanaMintTokens() {
  const { publicKey, isConnected, signTransaction } = useSolanaWallet();
  const { toast } = useToast();
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState('');
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [decimals, setDecimals] = useState('9');

  const handleMint = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      const signature = await mintTokens(
        connection,
        new PublicKey(publicKey),
        mintAddress,
        destination,
        parseFloat(amount),
        parseInt(decimals),
        signTransaction
      );

      toast({
        title: 'Tokens minted!',
        description: `Minted ${amount} tokens. Signature: ${signature.slice(0, 8)}...`,
      });

      setMintAddress('');
      setDestination('');
      setAmount('');
    } catch (error: any) {
      toast({
        title: 'Mint failed',
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
            Mint Tokens
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mint additional tokens to any wallet address
          </p>
        </div>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-cyan-500" />
              Mint Additional Tokens
            </CardTitle>
            <CardDescription>
              Requires mint authority for the token
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
              <Label htmlFor="destination">Destination Address *</Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter recipient wallet address"
                data-testid="input-destination"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to mint"
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
              onClick={handleMint}
              disabled={loading || !isConnected || !mintAddress || !destination || !amount}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              data-testid="button-mint"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Mint Tokens
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
