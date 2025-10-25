import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { getSolanaConnection } from '@/utils/solanaDeployer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, UserPlus, UserX, Image, Plus, Flame, Snowflake, Percent, Wallet, Loader2 } from 'lucide-react';
import {
  multisendTokens,
  transferAuthority,
  mintTokens,
  burnTokens,
  freezeTokenAccount,
  unfreezeTokenAccount,
} from '@/utils/solanaTools';
import { revokeMintAuthority, revokeFreezeAuthority } from '@/utils/solanaAuthority';

type SolanaNetwork = 'testnet' | 'mainnet-beta';

export default function ToolsSolana() {
  const { publicKey, isConnected, connect, signTransaction } = useSolanaWallet();
  const { toast } = useToast();
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [loading, setLoading] = useState(false);

  // Multisender state
  const [multisendMint, setMultisendMint] = useState('');
  const [multisendDecimals, setMultisendDecimals] = useState('9');
  const [multisendRecipients, setMultisendRecipients] = useState('');
  const [multisendOpen, setMultisendOpen] = useState(false);

  // Transfer Authority state
  const [transferMint, setTransferMint] = useState('');
  const [transferType, setTransferType] = useState<'mint' | 'freeze'>('mint');
  const [transferNewAuthority, setTransferNewAuthority] = useState('');
  const [transferOpen, setTransferOpen] = useState(false);

  // Revoke Authority state
  const [revokeMint, setRevokeMint] = useState('');
  const [revokeType, setRevokeType] = useState<'mint' | 'freeze'>('mint');
  const [revokeOpen, setRevokeOpen] = useState(false);

  // Mint Tokens state
  const [mintMint, setMintMint] = useState('');
  const [mintDestination, setMintDestination] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [mintDecimals, setMintDecimals] = useState('9');
  const [mintOpen, setMintOpen] = useState(false);

  // Burn Tokens state
  const [burnMint, setBurnMint] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [burnDecimals, setBurnDecimals] = useState('9');
  const [burnOpen, setBurnOpen] = useState(false);

  // Freeze/Unfreeze state
  const [freezeMint, setFreezeMint] = useState('');
  const [freezeAccount, setFreezeAccount] = useState('');
  const [freezeAction, setFreezeAction] = useState<'freeze' | 'unfreeze'>('freeze');
  const [freezeOpen, setFreezeOpen] = useState(false);

  // Update Metadata state
  const [metadataMint, setMetadataMint] = useState('');
  const [metadataName, setMetadataName] = useState('');
  const [metadataSymbol, setMetadataSymbol] = useState('');
  const [metadataUri, setMetadataUri] = useState('');
  const [metadataOpen, setMetadataOpen] = useState(false);

  const handleMultisend = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      // Parse recipients (format: address,amount per line)
      const lines = multisendRecipients.trim().split('\n');
      const recipients = lines.map(line => {
        const [address, amount] = line.split(',').map(s => s.trim());
        return { address, amount: parseFloat(amount) };
      });

      if (recipients.some(r => !r.address || isNaN(r.amount))) {
        throw new Error('Invalid recipient format. Use: address,amount per line');
      }

      const signature = await multisendTokens(
        connection,
        new PublicKey(publicKey),
        multisendMint,
        recipients,
        parseInt(multisendDecimals),
        signTransaction
      );

      toast({
        title: 'Multisend successful!',
        description: `Sent tokens to ${recipients.length} recipients. Signature: ${signature.slice(0, 8)}...`,
      });

      setMultisendOpen(false);
      setMultisendMint('');
      setMultisendRecipients('');
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

  const handleTransferAuthority = async () => {
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
        transferMint,
        transferType,
        transferNewAuthority,
        signTransaction
      );

      toast({
        title: 'Authority transferred!',
        description: `${transferType === 'mint' ? 'Mint' : 'Freeze'} authority transferred successfully. Signature: ${signature.slice(0, 8)}...`,
      });

      setTransferOpen(false);
      setTransferMint('');
      setTransferNewAuthority('');
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

  const handleRevokeAuthority = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      const signature = revokeType === 'mint'
        ? await revokeMintAuthority(connection, revokeMint, new PublicKey(publicKey), signTransaction)
        : await revokeFreezeAuthority(connection, revokeMint, new PublicKey(publicKey), signTransaction);

      toast({
        title: 'Authority revoked!',
        description: `${revokeType === 'mint' ? 'Mint' : 'Freeze'} authority permanently revoked. Signature: ${signature.slice(0, 8)}...`,
      });

      setRevokeOpen(false);
      setRevokeMint('');
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

  const handleMintTokens = async () => {
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
        mintMint,
        mintDestination,
        parseFloat(mintAmount),
        parseInt(mintDecimals),
        signTransaction
      );

      toast({
        title: 'Tokens minted!',
        description: `Minted ${mintAmount} tokens. Signature: ${signature.slice(0, 8)}...`,
      });

      setMintOpen(false);
      setMintMint('');
      setMintDestination('');
      setMintAmount('');
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

  const handleBurnTokens = async () => {
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
        burnMint,
        parseFloat(burnAmount),
        parseInt(burnDecimals),
        signTransaction
      );

      toast({
        title: 'Tokens burned!',
        description: `Burned ${burnAmount} tokens permanently. Signature: ${signature.slice(0, 8)}...`,
      });

      setBurnOpen(false);
      setBurnMint('');
      setBurnAmount('');
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

  const handleFreezeUnfreeze = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      const signature = freezeAction === 'freeze'
        ? await freezeTokenAccount(connection, new PublicKey(publicKey), freezeMint, freezeAccount, signTransaction)
        : await unfreezeTokenAccount(connection, new PublicKey(publicKey), freezeMint, freezeAccount, signTransaction);

      toast({
        title: `Account ${freezeAction}d!`,
        description: `Token account ${freezeAction}d successfully. Signature: ${signature.slice(0, 8)}...`,
      });

      setFreezeOpen(false);
      setFreezeMint('');
      setFreezeAccount('');
    } catch (error: any) {
      toast({
        title: `${freezeAction} failed`,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMetadata = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      // Dynamically import Metaplex tools
      const { updateTokenMetadata } = await import('@/utils/solanaMetadata');

      const signature = await updateTokenMetadata(
        connection,
        publicKey,
        metadataMint,
        {
          name: metadataName,
          symbol: metadataSymbol,
          uri: metadataUri,
        },
        signTransaction
      );

      toast({
        title: 'Metadata updated!',
        description: `Token metadata updated successfully. Signature: ${signature.slice(0, 8)}...`,
      });

      setMetadataOpen(false);
      setMetadataMint('');
      setMetadataName('');
      setMetadataSymbol('');
      setMetadataUri('');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 dark:from-purple-950 dark:via-purple-900 dark:to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Solana Tools</h1>
          <p className="text-purple-200 dark:text-purple-300">
            Advanced token management tools for your SPL tokens
          </p>
        </div>

        {/* Network Selector */}
        <Card className="mb-8 bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-white">Select Network</CardTitle>
            <CardDescription className="text-purple-200 dark:text-purple-300">
              Choose the Solana network for your operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={network} onValueChange={(v) => setNetwork(v as SolanaNetwork)}>
              <SelectTrigger className="w-64 bg-purple-800/50 dark:bg-purple-900/50 border-purple-600 dark:border-purple-700 text-white" data-testid="select-network">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="devnet" data-testid="option-devnet">Devnet</SelectItem>
                <SelectItem value="testnet" data-testid="option-testnet">Testnet</SelectItem>
                <SelectItem value="mainnet-beta" data-testid="option-mainnet">Mainnet Beta</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Wallet Connection */}
        {!isConnected && (
          <Card className="mb-8 bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-purple-300" />
                  <span className="text-white">Connect your wallet to use Solana tools</span>
                </div>
                <Button onClick={() => connect()} className="bg-purple-600 hover:bg-purple-700" data-testid="button-connect-wallet">
                  Connect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Multisender */}
          <Dialog open={multisendOpen} onOpenChange={setMultisendOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800 hover:border-purple-500" data-testid="card-multisender">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-700/50 dark:bg-purple-800/50 rounded-lg">
                      <Send className="h-6 w-6 text-purple-200" />
                    </div>
                    <CardTitle className="text-white">Multisender</CardTitle>
                  </div>
                  <CardDescription className="text-purple-200 dark:text-purple-300">
                    Send tokens to multiple addresses in one transaction
                  </CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-purple-900 dark:bg-purple-950 border-purple-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Multisender Tool</DialogTitle>
                <DialogDescription className="text-purple-200">
                  Send tokens to multiple recipients in a single transaction
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Token Mint Address</Label>
                  <Input
                    value={multisendMint}
                    onChange={(e) => setMultisendMint(e.target.value)}
                    placeholder="Enter mint address"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-multisend-mint"
                  />
                </div>
                <div>
                  <Label className="text-white">Token Decimals</Label>
                  <Input
                    type="number"
                    value={multisendDecimals}
                    onChange={(e) => setMultisendDecimals(e.target.value)}
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-multisend-decimals"
                  />
                </div>
                <div>
                  <Label className="text-white">Recipients (address,amount per line)</Label>
                  <Textarea
                    value={multisendRecipients}
                    onChange={(e) => setMultisendRecipients(e.target.value)}
                    placeholder="e.g.&#10;7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU,100&#10;8yGqKHZgKWtGbRXw3VvN1Qkqz3hUvFqCx7jRfYjXgzsK,200"
                    className="bg-purple-800/50 border-purple-600 text-white min-h-[120px]"
                    data-testid="textarea-multisend-recipients"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleMultisend} disabled={loading} className="bg-purple-600 hover:bg-purple-700" data-testid="button-send-tokens">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Tokens'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Transfer Authority */}
          <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800 hover:border-purple-500" data-testid="card-transfer-authority">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-700/50 dark:bg-purple-800/50 rounded-lg">
                      <UserPlus className="h-6 w-6 text-purple-200" />
                    </div>
                    <CardTitle className="text-white">Transfer Authority</CardTitle>
                  </div>
                  <CardDescription className="text-purple-200 dark:text-purple-300">
                    Transfer mint or freeze authority to another wallet
                  </CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-purple-900 dark:bg-purple-950 border-purple-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Transfer Authority</DialogTitle>
                <DialogDescription className="text-purple-200">
                  Transfer token authority to another wallet address
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Token Mint Address</Label>
                  <Input
                    value={transferMint}
                    onChange={(e) => setTransferMint(e.target.value)}
                    placeholder="Enter mint address"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-transfer-mint"
                  />
                </div>
                <div>
                  <Label className="text-white">Authority Type</Label>
                  <Select value={transferType} onValueChange={(v) => setTransferType(v as 'mint' | 'freeze')}>
                    <SelectTrigger className="bg-purple-800/50 border-purple-600 text-white" data-testid="select-transfer-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mint">Mint Authority</SelectItem>
                      <SelectItem value="freeze">Freeze Authority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">New Authority Address</Label>
                  <Input
                    value={transferNewAuthority}
                    onChange={(e) => setTransferNewAuthority(e.target.value)}
                    placeholder="Enter wallet address"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-transfer-new-authority"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleTransferAuthority} disabled={loading} className="bg-purple-600 hover:bg-purple-700" data-testid="button-transfer-authority">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Transfer Authority'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Revoke Authority */}
          <Dialog open={revokeOpen} onOpenChange={setRevokeOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800 hover:border-purple-500" data-testid="card-revoke-authority">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-700/50 dark:bg-purple-800/50 rounded-lg">
                      <UserX className="h-6 w-6 text-purple-200" />
                    </div>
                    <CardTitle className="text-white">Revoke Authority</CardTitle>
                  </div>
                  <CardDescription className="text-purple-200 dark:text-purple-300">
                    Permanently revoke mint or freeze authority
                  </CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-purple-900 dark:bg-purple-950 border-purple-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Revoke Authority</DialogTitle>
                <DialogDescription className="text-purple-200">
                  ⚠️ Warning: This action is permanent and cannot be undone
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Token Mint Address</Label>
                  <Input
                    value={revokeMint}
                    onChange={(e) => setRevokeMint(e.target.value)}
                    placeholder="Enter mint address"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-revoke-mint"
                  />
                </div>
                <div>
                  <Label className="text-white">Authority Type</Label>
                  <Select value={revokeType} onValueChange={(v) => setRevokeType(v as 'mint' | 'freeze')}>
                    <SelectTrigger className="bg-purple-800/50 border-purple-600 text-white" data-testid="select-revoke-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mint">Mint Authority</SelectItem>
                      <SelectItem value="freeze">Freeze Authority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleRevokeAuthority} disabled={loading} variant="destructive" data-testid="button-revoke-authority">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Revoke Authority'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Update Metadata */}
          <Dialog open={metadataOpen} onOpenChange={setMetadataOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800 hover:border-purple-500" data-testid="card-update-metadata">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-700/50 dark:bg-purple-800/50 rounded-lg">
                      <Image className="h-6 w-6 text-purple-200" />
                    </div>
                    <CardTitle className="text-white">Update Metadata</CardTitle>
                  </div>
                  <CardDescription className="text-purple-200 dark:text-purple-300">
                    Update token name, symbol, or metadata URI
                  </CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-purple-900 dark:bg-purple-950 border-purple-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Update Token Metadata</DialogTitle>
                <DialogDescription className="text-purple-200">
                  Update your token's on-chain metadata (name, symbol, URI)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Token Mint Address</Label>
                  <Input
                    value={metadataMint}
                    onChange={(e) => setMetadataMint(e.target.value)}
                    placeholder="Enter mint address"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-metadata-mint"
                  />
                </div>
                <div>
                  <Label className="text-white">Token Name</Label>
                  <Input
                    value={metadataName}
                    onChange={(e) => setMetadataName(e.target.value)}
                    placeholder="Enter new token name"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-metadata-name"
                  />
                </div>
                <div>
                  <Label className="text-white">Token Symbol</Label>
                  <Input
                    value={metadataSymbol}
                    onChange={(e) => setMetadataSymbol(e.target.value)}
                    placeholder="Enter new token symbol"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-metadata-symbol"
                  />
                </div>
                <div>
                  <Label className="text-white">Metadata URI (JSON)</Label>
                  <Input
                    value={metadataUri}
                    onChange={(e) => setMetadataUri(e.target.value)}
                    placeholder="https://arweave.net/..."
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-metadata-uri"
                  />
                  <p className="text-xs text-purple-300 mt-1">
                    Link to JSON metadata with token details and image
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateMetadata} disabled={loading} className="bg-purple-600 hover:bg-purple-700" data-testid="button-update-metadata">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Metadata'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Mint Tokens */}
          <Dialog open={mintOpen} onOpenChange={setMintOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800 hover:border-purple-500" data-testid="card-mint-tokens">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-700/50 dark:bg-purple-800/50 rounded-lg">
                      <Plus className="h-6 w-6 text-purple-200" />
                    </div>
                    <CardTitle className="text-white">Mint Tokens</CardTitle>
                  </div>
                  <CardDescription className="text-purple-200 dark:text-purple-300">
                    Mint additional tokens to any wallet
                  </CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-purple-900 dark:bg-purple-950 border-purple-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Mint Tokens</DialogTitle>
                <DialogDescription className="text-purple-200">
                  Mint additional tokens (requires mint authority)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Token Mint Address</Label>
                  <Input
                    value={mintMint}
                    onChange={(e) => setMintMint(e.target.value)}
                    placeholder="Enter mint address"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-mint-mint"
                  />
                </div>
                <div>
                  <Label className="text-white">Destination Address</Label>
                  <Input
                    value={mintDestination}
                    onChange={(e) => setMintDestination(e.target.value)}
                    placeholder="Enter recipient wallet address"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-mint-destination"
                  />
                </div>
                <div>
                  <Label className="text-white">Amount</Label>
                  <Input
                    type="number"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    placeholder="Enter amount to mint"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-mint-amount"
                  />
                </div>
                <div>
                  <Label className="text-white">Token Decimals</Label>
                  <Input
                    type="number"
                    value={mintDecimals}
                    onChange={(e) => setMintDecimals(e.target.value)}
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-mint-decimals"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleMintTokens} disabled={loading} className="bg-purple-600 hover:bg-purple-700" data-testid="button-mint-tokens">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Mint Tokens'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Burn Tokens */}
          <Dialog open={burnOpen} onOpenChange={setBurnOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800 hover:border-purple-500" data-testid="card-burn-tokens">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-700/50 dark:bg-purple-800/50 rounded-lg">
                      <Flame className="h-6 w-6 text-purple-200" />
                    </div>
                    <CardTitle className="text-white">Burn Tokens</CardTitle>
                  </div>
                  <CardDescription className="text-purple-200 dark:text-purple-300">
                    Permanently burn tokens from your wallet
                  </CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-purple-900 dark:bg-purple-950 border-purple-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Burn Tokens</DialogTitle>
                <DialogDescription className="text-purple-200">
                  ⚠️ Permanently destroy tokens (cannot be undone)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Token Mint Address</Label>
                  <Input
                    value={burnMint}
                    onChange={(e) => setBurnMint(e.target.value)}
                    placeholder="Enter mint address"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-burn-mint"
                  />
                </div>
                <div>
                  <Label className="text-white">Amount to Burn</Label>
                  <Input
                    type="number"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    placeholder="Enter amount to burn"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-burn-amount"
                  />
                </div>
                <div>
                  <Label className="text-white">Token Decimals</Label>
                  <Input
                    type="number"
                    value={burnDecimals}
                    onChange={(e) => setBurnDecimals(e.target.value)}
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-burn-decimals"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleBurnTokens} disabled={loading} variant="destructive" data-testid="button-burn-tokens">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Burn Tokens'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Freeze/Unfreeze */}
          <Dialog open={freezeOpen} onOpenChange={setFreezeOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800 hover:border-purple-500" data-testid="card-freeze-unfreeze">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-700/50 dark:bg-purple-800/50 rounded-lg">
                      <Snowflake className="h-6 w-6 text-purple-200" />
                    </div>
                    <CardTitle className="text-white">Freeze/Unfreeze</CardTitle>
                  </div>
                  <CardDescription className="text-purple-200 dark:text-purple-300">
                    Freeze or unfreeze token accounts
                  </CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-purple-900 dark:bg-purple-950 border-purple-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Freeze/Unfreeze Account</DialogTitle>
                <DialogDescription className="text-purple-200">
                  Freeze or unfreeze a token account (requires freeze authority)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Token Mint Address</Label>
                  <Input
                    value={freezeMint}
                    onChange={(e) => setFreezeMint(e.target.value)}
                    placeholder="Enter mint address"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-freeze-mint"
                  />
                </div>
                <div>
                  <Label className="text-white">Token Account to Freeze/Unfreeze</Label>
                  <Input
                    value={freezeAccount}
                    onChange={(e) => setFreezeAccount(e.target.value)}
                    placeholder="Enter token account address"
                    className="bg-purple-800/50 border-purple-600 text-white"
                    data-testid="input-freeze-account"
                  />
                </div>
                <div>
                  <Label className="text-white">Action</Label>
                  <Select value={freezeAction} onValueChange={(v) => setFreezeAction(v as 'freeze' | 'unfreeze')}>
                    <SelectTrigger className="bg-purple-800/50 border-purple-600 text-white" data-testid="select-freeze-action">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freeze">Freeze Account</SelectItem>
                      <SelectItem value="unfreeze">Unfreeze Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleFreezeUnfreeze} disabled={loading} className="bg-purple-600 hover:bg-purple-700" data-testid="button-freeze-unfreeze">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : freezeAction === 'freeze' ? 'Freeze Account' : 'Unfreeze Account'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Change Tax Settings - Not available for standard SPL */}
          <Card className="cursor-not-allowed opacity-60 bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800" data-testid="card-change-tax">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-700/50 dark:bg-purple-800/50 rounded-lg">
                  <Percent className="h-6 w-6 text-purple-200" />
                </div>
                <CardTitle className="text-white">Change Tax Settings</CardTitle>
              </div>
              <CardDescription className="text-purple-200 dark:text-purple-300">
                Requires Token-2022 with Transfer Fee extension
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Withdraw Fees - Not available for standard SPL */}
          <Card className="cursor-not-allowed opacity-60 bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800" data-testid="card-withdraw-fees">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-700/50 dark:bg-purple-800/50 rounded-lg">
                  <Wallet className="h-6 w-6 text-purple-200" />
                </div>
                <CardTitle className="text-white">Withdraw Fees</CardTitle>
              </div>
              <CardDescription className="text-purple-200 dark:text-purple-300">
                Requires Token-2022 with Transfer Fee extension
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-purple-900/50 dark:bg-purple-950/50 border-purple-700 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-white">Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-purple-200 dark:text-purple-300 space-y-2">
            <p>• <strong>Tax Settings & Fee Withdrawal</strong>: These features require Token-2022 program with Transfer Fee extension, not available for standard SPL tokens.</p>
            <p>• <strong>Authority Operations</strong>: Make sure you have the required authority (mint/freeze) before attempting these operations.</p>
            <p>• <strong>Irreversible Actions</strong>: Revoking authority and burning tokens are permanent and cannot be undone.</p>
            <p>• <strong>Network Fees</strong>: All operations require SOL for network transaction fees.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
