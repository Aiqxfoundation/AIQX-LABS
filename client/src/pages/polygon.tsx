import { TokenCreationFormComponent } from "@/components/token-creation-form";
import { type EvmTokenCreationForm } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useEvmWallet } from "@/contexts/EvmWalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import polygonLogo from "@assets/stock_images/polygon_matic_crypto_9126720d.jpg";

export default function Polygon() {
  const { address, isConnected, connect } = useEvmWallet();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const deployMutation = useMutation({
    mutationFn: async (data: EvmTokenCreationForm) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      let tokenRecordId: string | null = null;

      try {
        const response = await apiRequest("POST", "/api/tokens/deploy", {
          ...data,
          chainId: data.chainId || 'polygon-testnet',
          blockchainType: "EVM",
          deployerAddress: address,
        });
        const tokenRecord = await response.json();
        tokenRecordId = tokenRecord.id;

        const { deployEvmToken } = await import('@/utils/evmDeployer');
        const deploymentResult = await deployEvmToken(
          data.name,
          data.symbol,
          data.decimals,
          data.totalSupply,
          data.tokenType,
          data.chainId || 'polygon-testnet',
          data.taxPercentage,
          data.treasuryWallet,
        );

        await apiRequest("POST", `/api/tokens/${tokenRecordId}/status`, {
          status: "deployed",
          contractAddress: deploymentResult.contractAddress,
          transactionHash: deploymentResult.transactionHash,
        });

        return { ...tokenRecord, ...deploymentResult };
      } catch (error) {
        if (tokenRecordId) {
          try {
            await apiRequest("POST", `/api/tokens/${tokenRecordId}/status`, {
              status: "failed",
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
        title: "Polygon Token Deployed Successfully!",
        description: `Contract address: ${data.contractAddress}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tokens"] });
      setTimeout(() => setLocation("/dashboard"), 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Deployment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: EvmTokenCreationForm) => {
    deployMutation.mutate(data);
  };

  const handleConnectWallet = async () => {
    try {
      await connect();
      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been connected successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Connection Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container max-w-5xl py-12 px-4">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 p-0.5">
          <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
            <img 
              src={polygonLogo} 
              alt="Polygon logo"
              className="h-10 w-10 object-contain"
            />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
            Create Polygon Token
          </h1>
          <p className="text-muted-foreground">
            Deploy your custom token on Polygon Mainnet or Amoy Testnet
          </p>
        </div>
      </div>

      {!isConnected && (
        <Card className="mb-6 border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-600/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-semibold">Connect Your Wallet</p>
                  <p className="text-sm text-muted-foreground">Connect MetaMask or WalletConnect to deploy</p>
                </div>
              </div>
              <Button
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                data-testid="button-connect-polygon-wallet"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <TokenCreationFormComponent
        onSubmit={handleSubmit}
        isLoading={deployMutation.isPending}
        defaultChainId="polygon-testnet"
        allowedChainIds={['polygon-mainnet', 'polygon-testnet']}
      />
    </div>
  );
}
