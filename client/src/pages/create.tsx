import { TokenCreationFormComponent } from "@/components/token-creation-form";
import { type EvmTokenCreationForm } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wallet } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useEvmWallet } from "@/contexts/EvmWalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Create() {
  const { address, isConnected, connect } = useEvmWallet();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const deployMutation = useMutation({
    mutationFn: async (data: EvmTokenCreationForm) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      // Step 1: Create pending token record
      const response = await apiRequest("POST", "/api/tokens/deploy", {
        ...data,
        blockchainType: "EVM",
        deployerAddress: address,
      });
      const tokenRecord = await response.json();

      // Step 2: Deploy contract using wallet
      const { deployEvmToken } = await import('@/utils/evmDeployer');
      const deploymentResult = await deployEvmToken(
        data.name,
        data.symbol,
        data.decimals,
        data.totalSupply,
        data.tokenType,
        data.chainId,
        data.taxPercentage,
        data.treasuryWallet,
      );

      // Step 3: Update token record with deployment result
      await apiRequest("POST", `/api/tokens/${tokenRecord.id}/status`, {
        status: "deployed",
        contractAddress: deploymentResult.contractAddress,
        transactionHash: deploymentResult.transactionHash,
      });

      return { ...tokenRecord, ...deploymentResult };
    },
    onSuccess: (data) => {
      toast({
        title: "Token Deployed Successfully!",
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
        description: 'Your MetaMask wallet has been connected successfully',
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Create EVM Token
        </h1>
        <p className="text-muted-foreground">
          Deploy your custom ERC20 token on Ethereum, BSC, Polygon, Arbitrum, or Base
        </p>
      </div>

      {!isConnected && (
        <Card className="mb-6 border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-semibold">Connect Your Wallet</p>
                  <p className="text-sm text-muted-foreground">Connect MetaMask to deploy tokens</p>
                </div>
              </div>
              <Button
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                data-testid="button-connect-evm-wallet"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect MetaMask
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <TokenCreationFormComponent
        onSubmit={handleSubmit}
        isLoading={deployMutation.isPending}
      />
    </div>
  );
}
