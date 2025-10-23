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
import { ShieldX, Loader2, AlertTriangle } from 'lucide-react';
import { revokeMintAuthority } from '@/utils/solanaAuthority';
import MainLayout from '@/components/MainLayout';

type SolanaNetwork = 'devnet' | 'testnet' | 'mainnet-beta';

export default function SolanaRevokeMint() {
  const { publicKey, isConnected, signTransaction } = useSolanaWallet();
  const { toast } = useToast();
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState('');

  const handleRevoke = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      const signature = await revokeMintAuthority(
        connection,
        mintAddress,
        new PublicKey(publicKey),
        signTransaction
      );

      toast({
        title: 'Mint authority revoked!',
        description: `Mint authority permanently revoked. Signature: ${signature.slice(0, 8)}...`,
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
    <MainLayout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Revoke Mint Authority
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Permanently revoke the ability to mint additional tokens
          </p>
        </div>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldX className="h-5 w-5 text-cyan-500" />
              Revoke Mint Authority
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
                    Warning: This action is irreversible
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    Once revoked, no one will be able to mint additional tokens. This cannot be undone.
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

            <Button
              onClick={handleRevoke}
              disabled={loading || !isConnected || !mintAddress}
              variant="destructive"
              className="w-full"
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
                  Permanently Revoke Mint Authority
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
