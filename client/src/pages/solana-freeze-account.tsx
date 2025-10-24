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
import { Snowflake, Loader2 } from 'lucide-react';
import { freezeTokenAccount, unfreezeTokenAccount } from '@/utils/solanaTools';
import MainLayout from '@/components/MainLayout';
import { WalletRequired } from '@/components/WalletRequired';

type SolanaNetwork = 'devnet' | 'testnet' | 'mainnet-beta';

export default function SolanaFreezeAccount() {
  const { publicKey, isConnected, signTransaction } = useSolanaWallet();
  const { toast } = useToast();
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState('');
  const [accountAddress, setAccountAddress] = useState('');
  const [action, setAction] = useState<'freeze' | 'unfreeze'>('freeze');

  const handleFreeze = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      const signature = action === 'freeze'
        ? await freezeTokenAccount(connection, new PublicKey(publicKey), mintAddress, accountAddress, signTransaction)
        : await unfreezeTokenAccount(connection, new PublicKey(publicKey), mintAddress, accountAddress, signTransaction);

      toast({
        title: `Account ${action === 'freeze' ? 'frozen' : 'unfrozen'}!`,
        description: `Token account ${action === 'freeze' ? 'frozen' : 'unfrozen'} successfully. Signature: ${signature.slice(0, 8)}...`,
      });

      setMintAddress('');
      setAccountAddress('');
    } catch (error: any) {
      toast({
        title: `${action === 'freeze' ? 'Freeze' : 'Unfreeze'} failed`,
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
        description="Connect your Solana wallet to use this tool"
      >
        <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Freeze / Unfreeze Account
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Freeze or unfreeze a token account
          </p>
        </div>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-cyan-500" />
              Freeze / Unfreeze Token Account
            </CardTitle>
            <CardDescription>
              Requires freeze authority for the token
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
              <Label htmlFor="action">Action</Label>
              <Select value={action} onValueChange={(v) => setAction(v as 'freeze' | 'unfreeze')}>
                <SelectTrigger id="action" data-testid="select-action">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freeze">Freeze Account</SelectItem>
                  <SelectItem value="unfreeze">Unfreeze Account</SelectItem>
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
              <Label htmlFor="account">Token Account Address *</Label>
              <Input
                id="account"
                value={accountAddress}
                onChange={(e) => setAccountAddress(e.target.value)}
                placeholder="Enter token account address to freeze"
                data-testid="input-account-address"
              />
            </div>

            <Button
              onClick={handleFreeze}
              disabled={loading || !mintAddress || !accountAddress}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              data-testid="button-freeze"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {action === 'freeze' ? 'Freezing...' : 'Unfreezing...'}
                </>
              ) : (
                <>
                  <Snowflake className="mr-2 h-4 w-4" />
                  {action === 'freeze' ? 'Freeze Account' : 'Unfreeze Account'}
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
