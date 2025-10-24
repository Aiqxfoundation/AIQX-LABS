import { useState, useEffect } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { getSolanaConnection } from '@/utils/solanaDeployer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Image, Loader2, Info, ExternalLink, Upload, Link2 } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SolanaNetwork = 'devnet' | 'testnet' | 'mainnet-beta';

interface TokenAccount {
  mintAddress: string;
  balance: string;
  decimals: number;
}

export default function SolanaUpdateMetadata() {
  const { publicKey, isConnected, signTransaction } = useSolanaWallet();
  const { toast } = useToast();
  const [network, setNetwork] = useState<SolanaNetwork>('devnet');
  const [loading, setLoading] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
  const [mintAddress, setMintAddress] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [metadataUri, setMetadataUri] = useState('');

  const loadTokenAccounts = async () => {
    if (!publicKey || !isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    setLoadingTokens(true);
    try {
      const connection = getSolanaConnection(network);
      const { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } = await import('@solana/spl-token');
      
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(publicKey),
        { programId: TOKEN_PROGRAM_ID }
      );

      const tokens: TokenAccount[] = tokenAccounts.value
        .filter(account => {
          const amount = account.account.data.parsed.info.tokenAmount;
          return amount.uiAmount && amount.uiAmount > 0;
        })
        .map(account => ({
          mintAddress: account.account.data.parsed.info.mint,
          balance: account.account.data.parsed.info.tokenAmount.uiAmountString,
          decimals: account.account.data.parsed.info.tokenAmount.decimals,
        }));

      setTokenAccounts(tokens);
      
      if (tokens.length === 0) {
        toast({
          title: 'No tokens found',
          description: 'No tokens found in your wallet on this network',
        });
      } else {
        toast({
          title: 'Tokens loaded',
          description: `Found ${tokens.length} token(s) in your wallet`,
        });
      }
    } catch (error: any) {
      console.error('Error loading tokens:', error);
      toast({
        title: 'Failed to load tokens',
        description: error.message || 'Failed to fetch your token accounts',
        variant: 'destructive',
      });
    } finally {
      setLoadingTokens(false);
    }
  };

  useEffect(() => {
    if (isConnected && publicKey) {
      loadTokenAccounts();
    }
  }, [network, isConnected, publicKey]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImageBase64(base64);
      toast({
        title: 'Image uploaded',
        description: 'Image ready to be included in metadata',
      });
    };
    reader.readAsDataURL(file);
  };

  const validateInputs = (): boolean => {
    if (!mintAddress) {
      toast({
        title: 'Missing mint address',
        description: 'Please select or enter a token mint address',
        variant: 'destructive',
      });
      return false;
    }

    if (!name || !symbol) {
      toast({
        title: 'Missing required fields',
        description: 'Name and Symbol are required fields',
        variant: 'destructive',
      });
      return false;
    }

    if (name.length > 32) {
      toast({
        title: 'Name too long',
        description: 'Token name must be 32 characters or less',
        variant: 'destructive',
      });
      return false;
    }

    if (symbol.length > 10) {
      toast({
        title: 'Symbol too long',
        description: 'Token symbol must be 10 characters or less',
        variant: 'destructive',
      });
      return false;
    }

    if (imageMode === 'url' && imageUrl && !imageUrl.startsWith('http')) {
      toast({
        title: 'Invalid image URL',
        description: 'Image URL must start with http:// or https://',
        variant: 'destructive',
      });
      return false;
    }

    if (metadataUri && metadataUri.length > 200) {
      toast({
        title: 'URI too long',
        description: 'Metadata URI must be under 200 characters',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!isConnected || !publicKey || !signTransaction) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your Solana wallet first',
        variant: 'destructive',
      });
      return;
    }

    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      const connection = getSolanaConnection(network);

      const { Metaplex, walletAdapterIdentity } = await import('@metaplex-foundation/js');

      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity({
        publicKey: new PublicKey(publicKey),
        signTransaction: async (tx: Transaction) => {
          const signed = await signTransaction(tx);
          return signed;
        },
        signAllTransactions: async (txs: Transaction[]) => {
          const signed = await Promise.all(txs.map(tx => signTransaction(tx)));
          return signed;
        },
      }));

      const mintPublicKey = new PublicKey(mintAddress);
      const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });

      if (!nft) {
        throw new Error('Metadata not found for this token. The token may not have on-chain metadata.');
      }

      let finalUri = metadataUri;
      
      if (imageMode === 'upload' && imageBase64) {
        const imageToUse = imageBase64;
        finalUri = `data:application/json;base64,${btoa(JSON.stringify({
          name,
          symbol,
          description: `${name} (${symbol}) Token`,
          image: imageToUse,
        }))}`;
      } else if (imageMode === 'url' && imageUrl) {
        finalUri = `data:application/json;base64,${btoa(JSON.stringify({
          name,
          symbol,
          description: `${name} (${symbol}) Token`,
          image: imageUrl,
        }))}`;
      }

      const updateData: any = {
        nftOrSft: nft,
        name,
        symbol,
      };
      
      if (finalUri) {
        updateData.uri = finalUri;
      }

      const { response } = await metaplex.nfts().update(updateData);

      toast({
        title: 'Metadata updated successfully!',
        description: `Token metadata has been updated. Signature: ${response.signature.slice(0, 8)}...`,
      });

      setMintAddress('');
      setName('');
      setSymbol('');
      setImageUrl('');
      setImageBase64('');
      setMetadataUri('');
    } catch (error: any) {
      console.error('Update metadata error:', error);
      
      let errorMessage = error.message || 'Failed to update metadata';
      
      if (error.message?.includes('User rejected')) {
        errorMessage = 'Transaction was rejected in your wallet';
      } else if (error.message?.includes('Account does not exist')) {
        errorMessage = 'Token metadata account not found. Only tokens with metadata can be updated.';
      } else if (error.message?.includes('insufficient')) {
        errorMessage = 'Insufficient SOL balance to pay for transaction';
      } else if (error.message?.includes('authority')) {
        errorMessage = 'You are not the update authority for this token';
      }
      
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout currentChainId="solana">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Update Token Metadata
          </h1>
          <p className="text-gray-400">
            Update token name, symbol, and image for your Solana tokens
          </p>
        </div>

        {!isConnected ? (
          <Card className="border-yellow-500/20 bg-yellow-500/5 mb-6">
            <CardContent className="pt-6">
              <Alert className="border-yellow-500/20 bg-transparent">
                <Info className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-sm text-gray-300">
                  Please connect your Solana wallet using the "Connect Wallet" button at the top of the page to update token metadata.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          <>
            <Alert className="mb-6 border-cyan-500/20 bg-cyan-500/5">
              <Info className="h-4 w-4 text-cyan-500" />
              <AlertDescription className="text-sm text-gray-300">
                <strong>Requirements:</strong> You must be the update authority for the token. Name and Symbol are required fields. Image can be uploaded or provided as URL.
              </AlertDescription>
            </Alert>

            <Card className="border-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-cyan-500" />
                  Update Token Metadata
                </CardTitle>
                <CardDescription>
                  Modify your token's on-chain metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                  <div className="flex items-center justify-between">
                    <Label>Select Token from Wallet</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadTokenAccounts}
                      disabled={loadingTokens || !isConnected}
                      data-testid="button-load-tokens"
                    >
                      {loadingTokens ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Refresh Tokens'
                      )}
                    </Button>
                  </div>
                  <Select value={mintAddress} onValueChange={setMintAddress}>
                    <SelectTrigger data-testid="select-token">
                      <SelectValue placeholder={loadingTokens ? "Loading tokens..." : tokenAccounts.length === 0 ? "No tokens found - connect wallet and refresh" : "Select a token from your wallet"} />
                    </SelectTrigger>
                    <SelectContent>
                      {tokenAccounts.map((token) => (
                        <SelectItem key={token.mintAddress} value={token.mintAddress}>
                          {token.mintAddress.slice(0, 8)}...{token.mintAddress.slice(-6)} (Balance: {token.balance})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Token Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter token name (required)"
                    data-testid="input-name"
                    maxLength={32}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Maximum 32 characters (Required)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symbol">Token Symbol *</Label>
                  <Input
                    id="symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    placeholder="Enter token symbol (required)"
                    data-testid="input-symbol"
                    maxLength={10}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Maximum 10 characters (Required)</p>
                </div>

                <div className="space-y-2">
                  <Label>Token Image</Label>
                  <Tabs value={imageMode} onValueChange={(v) => setImageMode(v as 'url' | 'upload')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="url" data-testid="tab-url">
                        <Link2 className="h-4 w-4 mr-2" />
                        Image URL
                      </TabsTrigger>
                      <TabsTrigger value="upload" data-testid="tab-upload">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="space-y-2">
                      <Input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.png"
                        data-testid="input-image-url"
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter a direct link to your token image
                      </p>
                    </TabsContent>
                    <TabsContent value="upload" className="space-y-2">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          data-testid="input-image-upload"
                          className="cursor-pointer"
                        />
                        {imageBase64 && (
                          <div className="flex-shrink-0">
                            <img 
                              src={imageBase64} 
                              alt="Preview" 
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

                <div className="space-y-2">
                  <Label htmlFor="uri">Custom Metadata URI (Optional)</Label>
                  <Input
                    id="uri"
                    type="url"
                    value={metadataUri}
                    onChange={(e) => setMetadataUri(e.target.value)}
                    placeholder="https://example.com/metadata.json"
                    data-testid="input-uri"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">
                    Override with a custom hosted JSON metadata file (max 200 chars). Leave empty to auto-generate from above fields.
                  </p>
                </div>

                <Button
                  onClick={handleUpdate}
                  disabled={loading || !isConnected || !mintAddress || !name || !symbol}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  data-testid="button-update"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Metadata...
                    </>
                  ) : (
                    <>
                      <Image className="mr-2 h-4 w-4" />
                      Update Metadata
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}
