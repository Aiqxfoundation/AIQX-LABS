import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, ExternalLink, AlertCircle } from "lucide-react";
import { useEvmWallet } from "@/contexts/EvmWalletContext";
import { useSolanaWallet, type WalletProvider } from "@/contexts/SolanaWalletContext";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ChainType = 'evm' | 'solana';

interface UnifiedWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  chainType: ChainType;
}

interface WalletOption {
  id: string;
  name: string;
  description: string;
  logo: ReactNode;
  installUrl?: string;
  isAvailable: boolean;
}

export function UnifiedWalletModal({ isOpen, onClose, chainType }: UnifiedWalletModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  
  const evmWallet = useEvmWallet();
  const solanaWallet = useSolanaWallet();
  const { toast } = useToast();

  const evmWallets: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect with MetaMask browser extension',
      logo: (
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <Wallet className="h-5 w-5 text-white" />
        </div>
      ),
      installUrl: 'https://metamask.io/download/',
      isAvailable: evmWallet.isMetaMaskInstalled,
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Scan QR code with your mobile wallet',
      logo: (
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Wallet className="h-5 w-5 text-white" />
        </div>
      ),
      installUrl: undefined,
      isAvailable: false,
    },
  ];

  const getSolanaWalletLogo = (walletId: string) => {
    const logos: Record<string, React.ReactNode> = {
      phantom: (
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
      ),
      okx: (
        <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
          <span className="text-white font-bold text-xs">OKX</span>
        </div>
      ),
      solflare: (
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
      ),
      backpack: (
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">B</span>
        </div>
      ),
    };
    return logos[walletId] || <Wallet className="h-8 w-8" />;
  };

  const solanaWallets: WalletOption[] = [
    {
      id: 'phantom',
      name: 'Phantom',
      description: 'Most popular Solana wallet',
      logo: getSolanaWalletLogo('phantom'),
      installUrl: 'https://phantom.app/download',
      isAvailable: solanaWallet.availableWallets.includes('phantom'),
    },
    {
      id: 'okx',
      name: 'OKX Wallet',
      description: 'Multi-chain wallet with great UX',
      logo: getSolanaWalletLogo('okx'),
      installUrl: 'https://www.okx.com/web3',
      isAvailable: solanaWallet.availableWallets.includes('okx'),
    },
    {
      id: 'solflare',
      name: 'Solflare',
      description: 'Powerful Solana wallet',
      logo: getSolanaWalletLogo('solflare'),
      installUrl: 'https://solflare.com/download',
      isAvailable: solanaWallet.availableWallets.includes('solflare'),
    },
    {
      id: 'backpack',
      name: 'Backpack',
      description: 'Modern wallet for Solana',
      logo: getSolanaWalletLogo('backpack'),
      installUrl: 'https://backpack.app/downloads',
      isAvailable: solanaWallet.availableWallets.includes('backpack'),
    },
  ];

  const wallets = chainType === 'evm' ? evmWallets : solanaWallets;

  const handleConnect = async (walletId: string) => {
    setIsConnecting(true);
    setConnectingWallet(walletId);

    try {
      if (chainType === 'evm') {
        if (walletId === 'metamask') {
          if (!evmWallet.isMetaMaskInstalled) {
            window.open('https://metamask.io/download/', '_blank');
            throw new Error('Please install MetaMask first');
          }
          await evmWallet.connect();
          toast({
            title: "Wallet connected",
            description: "Successfully connected to MetaMask",
          });
        } else if (walletId === 'walletconnect') {
          toast({
            title: "Coming soon",
            description: "WalletConnect integration is coming soon",
            variant: "default",
          });
          return;
        }
      } else {
        await solanaWallet.connect(walletId as WalletProvider);
        toast({
          title: "Wallet connected",
          description: `Successfully connected to ${walletId.charAt(0).toUpperCase() + walletId.slice(1)}`,
        });
      }
      onClose();
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
      setConnectingWallet(null);
    }
  };

  const handleInstall = (installUrl: string) => {
    window.open(installUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-unified-wallet">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-[#00d4ff]" />
            Connect {chainType === 'evm' ? 'EVM' : 'Solana'} Wallet
          </DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to the {chainType === 'evm' ? 'Ethereum Virtual Machine' : 'Solana'} blockchain
          </DialogDescription>
        </DialogHeader>

        {chainType === 'evm' && !evmWallet.isMetaMaskInstalled && (
          <Alert className="bg-orange-900/20 border-orange-500/50">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-sm text-orange-200">
              No EVM wallet detected. Please install MetaMask or another Web3 wallet to continue.
            </AlertDescription>
          </Alert>
        )}

        {chainType === 'solana' && solanaWallet.availableWallets.length === 0 && (
          <Alert className="bg-purple-900/20 border-purple-500/50">
            <AlertCircle className="h-4 w-4 text-purple-500" />
            <AlertDescription className="text-sm text-purple-200">
              No Solana wallet detected. Please install a Solana wallet to continue.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 mt-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="group relative"
            >
              {wallet.isAvailable ? (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-4 h-auto p-4 hover:border-[#00d4ff] hover:bg-[#00d4ff]/5 transition-all"
                  onClick={() => handleConnect(wallet.id)}
                  disabled={isConnecting}
                  data-testid={`button-wallet-${wallet.id}`}
                >
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center">
                    {wallet.logo}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-white">{wallet.name}</p>
                    <p className="text-sm text-gray-400">
                      {wallet.description}
                    </p>
                  </div>
                  {isConnecting && connectingWallet === wallet.id && (
                    <Loader2 className="h-5 w-5 animate-spin text-[#00d4ff]" />
                  )}
                </Button>
              ) : (
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-4 h-auto p-4 opacity-50 cursor-not-allowed"
                    disabled
                    data-testid={`button-wallet-${wallet.id}-unavailable`}
                  >
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center grayscale">
                      {wallet.logo}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-400">{wallet.name}</p>
                      <p className="text-sm text-gray-500">
                        Not installed
                      </p>
                    </div>
                  </Button>
                  {wallet.installUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 gap-1 text-[#00d4ff] hover:text-[#00b8e6] hover:bg-[#00d4ff]/10"
                      onClick={() => handleInstall(wallet.installUrl!)}
                      data-testid={`button-install-${wallet.id}`}
                    >
                      Install
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800">
          <p className="text-xs text-center text-gray-500">
            By connecting a wallet, you agree to the Terms of Service
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
