import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { Coins, Wallet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { useSolanaWallet, type WalletProvider } from '@/contexts/SolanaWalletContext';
import { SUPPORTED_CHAINS, SOLANA_TOKEN_TYPES, solanaTokenCreationSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

const formSchema = solanaTokenCreationSchema.extend({
  deployerAddress: z.string().min(1, 'Please connect your wallet'),
});

type FormData = z.infer<typeof formSchema>;

const WALLET_NAMES: Record<WalletProvider, string> = {
  phantom: 'Phantom',
  okx: 'OKX Wallet',
  solflare: 'Solflare',
  backpack: 'Backpack',
  unknown: 'Unknown',
};

export default function CreateSolanaToken() {
  const { toast } = useToast();
  const { publicKey, isConnected, connect, availableWallets, walletProvider } = useSolanaWallet();
  const [logoBase64, setLogoBase64] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      symbol: '',
      decimals: 9,
      totalSupply: '',
      tokenType: 'standard',
      chainId: 'solana-devnet',
      description: '',
      logoUrl: '',
      enableMintAuthority: false,
      enableFreezeAuthority: false,
      deployerAddress: '',
    },
  });

  useEffect(() => {
    if (publicKey) {
      form.setValue('deployerAddress', publicKey);
    }
  }, [publicKey, form]);

  const deployMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      console.log('Starting SPL token deployment...', data);

      let tokenRecordId: string | null = null;

      try {
        // Step 1: Create pending token record
        toast({
          title: 'Creating token record...',
          description: 'Preparing your SPL token deployment',
        });
        
        const response = await apiRequest('POST', '/api/deploy', {
          ...data,
          blockchainType: 'Solana',
          logoUrl: logoBase64 || undefined,
        });
        const tokenRecord = await response.json();
        tokenRecordId = tokenRecord.id;
        console.log('Token record created:', tokenRecordId);

        // Step 2: Deploy SPL token using wallet
        toast({
          title: 'Requesting wallet approval...',
          description: 'Please approve the transaction in your Phantom wallet',
        });
        
        const { deploySolanaToken } = await import('@/utils/solanaDeployer');
        const deploymentResult = await deploySolanaToken(
          data.name,
          data.symbol,
          data.decimals,
          data.totalSupply,
          data.chainId,
          data.enableMintAuthority,
          data.enableFreezeAuthority,
        );
        console.log('Deployment result:', deploymentResult);

        // Step 3: Update token record with deployment result
        toast({
          title: 'Confirming transaction...',
          description: 'Updating token record with deployment details',
        });
        
        await apiRequest('POST', `/api/tokens/${tokenRecordId}/status`, {
          status: 'deployed',
          contractAddress: deploymentResult.mintAddress,
          transactionHash: deploymentResult.transactionSignature,
        });

        return { ...tokenRecord, ...deploymentResult };
      } catch (error) {
        console.error('Deployment error:', error);
        
        // Mark the original pending record as failed
        if (tokenRecordId) {
          try {
            await apiRequest('POST', `/api/tokens/${tokenRecordId}/status`, {
              status: 'failed',
            });
          } catch (updateError) {
            console.error('Failed to update token status:', updateError);
          }
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: '✅ SPL Token Deployed Successfully!',
        description: `Mint address: ${data.mintAddress || data.contractAddress}`,
      });
      form.reset();
      setLogoBase64('');
      form.setValue('deployerAddress', '');
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: '❌ Deployment Failed',
        description: error.message || 'Failed to deploy token. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleConnectWallet = async (walletType?: WalletProvider) => {
    try {
      await connect(walletType);
      const walletName = walletType ? WALLET_NAMES[walletType] : 'Wallet';
      toast({
        title: 'Wallet Connected',
        description: `Your ${walletName} has been connected successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Connection Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const onSubmit = (data: FormData) => {
    if (!isConnected || !publicKey) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your Phantom wallet to deploy',
        variant: 'destructive',
      });
      return;
    }

    deployMutation.mutate({
      ...data,
      deployerAddress: publicKey,
    });
  };

  return (
    <div className="container max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Create Solana Token
        </h1>
        <p className="text-muted-foreground">
          Deploy your custom SPL token on Solana with complete control over token authorities
        </p>
      </div>

      {!isConnected && (
        <Card className="mb-6 border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-semibold">Connect Your Wallet</p>
                  <p className="text-sm text-muted-foreground">
                    Choose a wallet to deploy your SPL token
                  </p>
                </div>
              </div>
              
              {availableWallets.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    No Solana wallet detected. Please install one:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">
                        Install Phantom
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.okx.com/web3" target="_blank" rel="noopener noreferrer">
                        Install OKX
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer">
                        Install Solflare
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {availableWallets.map((wallet) => (
                    <Button
                      key={wallet}
                      onClick={() => handleConnectWallet(wallet)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      data-testid={`button-connect-${wallet}`}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      {WALLET_NAMES[wallet]}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {isConnected && walletProvider && (
        <Card className="mb-6 border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <div>
                  <p className="font-semibold">{WALLET_NAMES[walletProvider]} Connected</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Information</CardTitle>
              <CardDescription>Basic details about your SPL token</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Solana Token" {...field} data-testid="input-token-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="MST" {...field} data-testid="input-token-symbol" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of your token..."
                        className="min-h-[80px]"
                        {...field}
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Logo (Optional)</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={logoBase64}
                        onChange={(base64) => {
                          setLogoBase64(base64);
                          field.onChange(base64);
                        }}
                        onRemove={() => {
                          setLogoBase64('');
                          field.onChange('');
                        }}
                      />
                    </FormControl>
                    <FormDescription>Upload a logo for your token (max 2MB)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Token Configuration</CardTitle>
              <CardDescription>Define your token's technical parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="chainId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-network">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solana-devnet">Solana Devnet</SelectItem>
                        <SelectItem value="solana-testnet">Solana Testnet</SelectItem>
                        <SelectItem value="solana-mainnet">Solana Mainnet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tokenType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-token-type">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(SOLANA_TOKEN_TYPES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex flex-col">
                              <span className="font-medium">{value.name}</span>
                              <span className="text-xs text-muted-foreground">{value.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="decimals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Decimals</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={9}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-decimals"
                        />
                      </FormControl>
                      <FormDescription>Usually 9 for Solana tokens</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalSupply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Supply</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1000000" 
                          {...field} 
                          data-testid="input-total-supply" 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter 0 for unlimited supply (requires mint authority enabled)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authority Controls</CardTitle>
              <CardDescription>Manage token authorities for enhanced control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="enableMintAuthority"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mint Authority</FormLabel>
                      <FormDescription>
                        Enable to mint additional tokens after deployment
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-mint-authority"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enableFreezeAuthority"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Freeze Authority</FormLabel>
                      <FormDescription>
                        Enable to freeze/unfreeze token accounts
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-freeze-authority"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={deployMutation.isPending || !isConnected}
            data-testid="button-deploy-token"
          >
            {deployMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying Token...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Deploy SPL Token
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
