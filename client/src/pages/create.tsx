import { useState } from "react";
import { TokenCreationFormComponent } from "@/components/token-creation-form";
import { WalletButton } from "@/components/wallet-button";
import { type EvmTokenCreationForm } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Create() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const deployMutation = useMutation({
    mutationFn: async (data: EvmTokenCreationForm) => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }

      return await apiRequest("POST", "/api/tokens/deploy", {
        ...data,
        blockchainType: "EVM",
        deployerAddress: walletAddress,
      });
    },
    onSuccess: () => {
      toast({
        title: "Token Deployment Started",
        description: "Your token is being deployed. Check the dashboard for status.",
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

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create Your Token</h1>
            <p className="text-muted-foreground">
              Configure and deploy your custom ERC20 token to any supported blockchain
            </p>
          </div>
          <WalletButton address={walletAddress} onConnect={setWalletAddress} />
        </div>

        {!walletAddress && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to deploy tokens
            </AlertDescription>
          </Alert>
        )}

        <TokenCreationFormComponent
          onSubmit={handleSubmit}
          isLoading={deployMutation.isPending}
        />
      </div>
    </div>
  );
}
