import { ReactNode, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, AlertCircle } from "lucide-react";
import { useSolanaWallet } from "@/contexts/SolanaWalletContext";
import { UnifiedWalletModal } from "./unified-wallet-modal";

interface WalletRequiredProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function WalletRequired({ 
  children,
  title = "Wallet Connection Required",
  description = "Please connect your Solana wallet to use this tool"
}: WalletRequiredProps) {
  const { isConnected } = useSolanaWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);

  if (!isConnected) {
    return (
      <>
        <div className="max-w-2xl mx-auto py-12 px-4">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-cyan-500" />
              </div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-base">{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium mb-1">Why do I need to connect?</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    This tool requires access to your Solana wallet to sign transactions. 
                    Your private keys always remain secure in your wallet and are never exposed.
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => setShowWalletModal(true)}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white h-12 text-base"
                data-testid="button-connect-wallet-required"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet to Continue
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Supported wallets: Phantom, OKX Wallet, Solflare, Backpack
              </p>
            </CardContent>
          </Card>
        </div>

        <UnifiedWalletModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          chainType="solana"
        />
      </>
    );
  }

  return <>{children}</>;
}
