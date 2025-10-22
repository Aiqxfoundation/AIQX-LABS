import { useState } from 'react';
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
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { SUPPORTED_CHAINS, SOLANA_TOKEN_TYPES, solanaTokenCreationSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

const formSchema = solanaTokenCreationSchema.extend({
  deployerAddress: z.string().min(1, 'Please connect your wallet'),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateSolanaToken() {
  const { toast } = useToast();
  const { publicKey, isConnected, connect } = useSolanaWallet();
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
      deployerAddress: publicKey || '',
    },
  });

  const deployMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      // Step 1: Create pending token record
      const response = await apiRequest('POST', '/api/deploy', {
        ...data,
        blockchainType: 'Solana',
        logoUrl: logoBase64 || undefined,
      });
      const tokenRecord = await response.json();

      // Step 2: Deploy SPL token using wallet
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

      // Step 3: Update token record with deployment result
      await apiRequest('POST', `/api/tokens/${tokenRecord.id}/status`, {
        status: 'deployed',
        contractAddress: deploymentResult.mintAddress,
        transactionHash: deploymentResult.transactionSignature,
      });

      return { ...tokenRecord, ...deploymentResult };
    },
    onSuccess: (data) => {
      toast({
        title: 'SPL Token Deployed Successfully!',
        description: `Mint address: ${data.mintAddress || data.contractAddress}`,
      });
      form.reset();
      setLogoBase64('');
    },
    onError: (error: any) => {
      toast({
        title: 'Deployment Failed',
        description: error.message || 'Failed to deploy token',
        variant: 'destructive',
      });
    },
  });

  const handleConnectWallet = async () => {
    try {
      await connect();
      toast({
        title: 'Wallet Connected',
        description: 'Your Phantom wallet has been connected successfully',
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-semibold">Connect Your Wallet</p>
                  <p className="text-sm text-muted-foreground">Connect Phantom to deploy tokens</p>
                </div>
              </div>
              <Button
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                data-testid="button-connect-solana-wallet"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Phantom
              </Button>
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
                        <Input placeholder="1000000" {...field} data-testid="input-total-supply" />
                      </FormControl>
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
