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
import { UserPlus, Loader2 } from 'lucide-react';
import { transferAuthority } from '@/utils/solanaTools';
import MainLayout from '@/components/MainLayout';

type SolanaNetwork = 'devnet' | 'testnet' | 'mainnet-beta';

export default function SolanaTransferAuthority() {
  const { publicKey, isConnected, signTransaction } = useSolanaWallet();
  const { toast } = useToast();
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState('');
  const [authorityType, setAuthorityType] = useState<'mint' | 'freeze'>('mint');
  const [newAuthority, setNewAuthority] = useState('');

  const handleTransfer = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      const signature = await transferAuthority(
        connection,
        new PublicKey(publicKey),
        mintAddress,
        authorityType,
        newAuthority,
        signTransaction
      );

      toast({
        title: 'Authority transferred!',
        description: `${authorityType === 'mint' ? 'Mint' : 'Freeze'} authority transferred successfully. Signature: ${signature.slice(0, 8)}...`,
      });

      setMintAddress('');
      setNewAuthority('');
    } catch (error: any) {
      toast({
        title: 'Transfer failed',
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
            Transfer Authority
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Transfer mint or freeze authority to a new wallet address
          </p>
        </div>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-cyan-500" />
              Transfer Token Authority
            </CardTitle>
            <CardDescription>
              Transfer control of your token to another wallet
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
              <Label htmlFor="type">Authority Type</Label>
              <Select value={authorityType} onValueChange={(v) => setAuthorityType(v as 'mint' | 'freeze')}>
                <SelectTrigger id="type" data-testid="select-authority-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mint">Mint Authority</SelectItem>
                  <SelectItem value="freeze">Freeze Authority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newAuthority">New Authority Address *</Label>
              <Input
                id="newAuthority"
                value={newAuthority}
                onChange={(e) => setNewAuthority(e.target.value)}
                placeholder="Enter new authority wallet address"
                data-testid="input-new-authority"
              />
            </div>

            <Button
              onClick={handleTransfer}
              disabled={loading || !isConnected || !mintAddress || !newAuthority}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              data-testid="button-transfer"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transferring...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Transfer Authority
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
