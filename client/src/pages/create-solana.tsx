import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { Coins, Wallet, Loader2, DollarSign, Upload, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSolanaWallet, type WalletProvider } from '@/contexts/SolanaWalletContext';
import { SUPPORTED_CHAINS, solanaTokenCreationSchema, type ChainId } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { SolanaNetworkSwitcher } from '@/components/solana-network-switcher';
import { type FeeEstimate } from '@/utils/solanaDeployer';

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
  const [logoMode, setLogoMode] = useState<'url' | 'upload'>('url');
  const [feeEstimate, setFeeEstimate] = useState<FeeEstimate | null>(null);
  const [isLoadingFees, setIsLoadingFees] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      symbol: '',
      decimals: 9,
      totalSupply: '',
      chainId: 'solana-devnet',
      description: '',
      logoUrl: '',
      enableMintAuthority: true,
      enableFreezeAuthority: true,
      enableUpdateAuthority: true,
      deployerAddress: '',
    },
  });

  useEffect(() => {
    if (publicKey) {
      form.setValue('deployerAddress', publicKey);
    }
  }, [publicKey, form]);

  // Load fee estimate when network changes
  useEffect(() => {
    const loadFees = async () => {
      const chainId = form.watch('chainId');
      if (!chainId) return;
      
      setIsLoadingFees(true);
      try {
        const { estimateDeploymentFees } = await import('@/utils/solanaDeployer');
        const fees = await estimateDeploymentFees(chainId);
        setFeeEstimate(fees);
      } catch (error) {
        console.error('Failed to load fees:', error);
      } finally {
        setIsLoadingFees(false);
      }
    };
    
    loadFees();
  }, [form.watch('chainId')]);

  const handleNetworkChange = (network: ChainId) => {
    // Only accept Solana networks
    if (network.startsWith('solana-')) {
      form.setValue('chainId', network as 'solana-devnet' | 'solana-testnet' | 'solana-mainnet');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setLogoBase64(base64);
      toast({
        title: 'Image uploaded',
        description: 'Logo image is ready to be included with your token',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoModeChange = (newMode: 'url' | 'upload') => {
    setLogoMode(newMode);
    // Clear logoBase64 when switching to upload mode to prevent URL leakage
    if (newMode === 'upload') {
      setLogoBase64('');
    }
  };

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
        
        // Use uploaded image if in upload mode, otherwise use URL from form
        // Defensive check: only send base64 data URIs in upload mode
        let finalLogoUrl: string | undefined = undefined;
        if (logoMode === 'upload') {
          // Only use logoBase64 if it's actually a data URI
          if (logoBase64 && logoBase64.startsWith('data:')) {
            finalLogoUrl = logoBase64;
          }
        } else {
          // URL mode: use the form's logoUrl field
          finalLogoUrl = data.logoUrl || undefined;
        }
        
        const response = await apiRequest('POST', '/api/deploy', {
          ...data,
          blockchainType: 'Solana',
          logoUrl: finalLogoUrl,
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
          data.enableUpdateAuthority,
          finalLogoUrl,
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
        description: 'Please connect your wallet using the "Connect Wallet" button at the top of the page',
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
    <div className="container max-w-4xl py-6 px-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Create Solana Token
        </h1>
        <p className="text-sm text-muted-foreground">
          Deploy your custom SPL token on Solana with complete control over token authorities
        </p>
      </div>

      {!isConnected ? (
        <Card className="mb-6 border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-semibold text-white">Wallet Not Connected</p>
                <p className="text-sm text-muted-foreground">
                  Please connect your Solana wallet using the "Connect Wallet" button at the top of the page to deploy your token.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <SolanaNetworkSwitcher
            currentNetwork={form.watch('chainId')}
            onNetworkChange={handleNetworkChange}
            isConnected={isConnected}
          />

          <Card className="p-4 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Network Fee</p>
                  {isLoadingFees ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <p className="text-sm">Loading...</p>
                    </div>
                  ) : feeEstimate ? (
                    <p className="font-semibold text-lg">
                      ~{feeEstimate.totalFee.toFixed(6)} SOL
                    </p>
                  ) : (
                    <p className="font-semibold text-lg">~0.002 SOL</p>
                  )}
                </div>
              </div>
              {feeEstimate && (
                <div className="text-right text-xs text-muted-foreground">
                  <p>Rent: {feeEstimate.rentFee.toFixed(6)}</p>
                  <p>TX Fee: {feeEstimate.transactionFee.toFixed(6)}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Token Logo (Optional)</label>
                <Tabs value={logoMode} onValueChange={(v) => handleLogoModeChange(v as 'url' | 'upload')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url" data-testid="tab-logo-url">
                      <Link2 className="h-4 w-4 mr-2" />
                      Image URL
                    </TabsTrigger>
                    <TabsTrigger value="upload" data-testid="tab-logo-upload">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="space-y-2">
                    <FormField
                      control={form.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://example.com/logo.png"
                              {...field}
                              data-testid="input-logo-url"
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a direct link to your token logo
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="upload" className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        data-testid="input-logo-upload"
                        className="cursor-pointer"
                      />
                      {logoBase64 && logoMode === 'upload' && logoBase64.startsWith('data:') && (
                        <div className="flex-shrink-0">
                          <img 
                            src={logoBase64} 
                            alt="Logo preview" 
                            className="h-16 w-16 object-cover rounded border border-gray-700"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload an image file (max 5MB). Image will be embedded in metadata.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
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

              <FormField
                control={form.control}
                name="enableUpdateAuthority"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Update Authority</FormLabel>
                      <FormDescription>
                        Enable to update token metadata (name, symbol, logo) after deployment
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-update-authority"
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
