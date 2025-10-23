import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { getSolanaConnection } from '@/utils/solanaDeployer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { multisendTokens } from '@/utils/solanaTools';
import MainLayout from '@/components/MainLayout';

type SolanaNetwork = 'devnet' | 'testnet' | 'mainnet-beta';

export default function SolanaMultisender() {
  const { publicKey, isConnected, signTransaction } = useSolanaWallet();
  const { toast } = useToast();
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState('');
  const [decimals, setDecimals] = useState('9');
  const [recipients, setRecipients] = useState('');

  const handleMultisend = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      const lines = recipients.trim().split('\n');
      const recipientList = lines.map(line => {
        const [address, amount] = line.split(',').map(s => s.trim());
        return { address, amount: parseFloat(amount) };
      });

      if (recipientList.some(r => !r.address || isNaN(r.amount))) {
        throw new Error('Invalid recipient format. Use: address,amount per line');
      }

      const signature = await multisendTokens(
        connection,
        new PublicKey(publicKey),
        mintAddress,
        recipientList,
        parseInt(decimals),
        signTransaction
      );

      toast({
        title: 'Multisend successful!',
        description: `Sent tokens to ${recipientList.length} recipients. Signature: ${signature.slice(0, 8)}...`,
      });

      setMintAddress('');
      setRecipients('');
    } catch (error: any) {
      toast({
        title: 'Multisend failed',
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
            Multisender
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Send tokens to multiple addresses in one transaction
          </p>
        </div>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-cyan-500" />
              Batch Send Tokens
            </CardTitle>
            <CardDescription>
              Enter recipient addresses and amounts (one per line: address,amount)
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

            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients *</Label>
              <Textarea
                id="recipients"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="Address1,100&#10;Address2,250&#10;Address3,500"
                rows={6}
                className="font-mono text-sm"
                data-testid="textarea-recipients"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Format: wallet_address,amount (one per line)
              </p>
            </div>

            <Button
              onClick={handleMultisend}
              disabled={loading || !isConnected || !mintAddress || !recipients}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              data-testid="button-multisend"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send to All Recipients
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
