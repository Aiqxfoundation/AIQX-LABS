import { useState } from "react";
import MobileMenu from "./MobileMenu";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Menu, Settings, Wallet, Check, LogOut, AlertCircle, Loader2 } from "lucide-react";
import { getChainConfig } from "@/config/chains";
import { useEvmWallet } from "@/contexts/EvmWalletContext";
import { NetworkSwitcher } from "./network-switcher";
import { MetaMaskInstallModal } from "./metamask-install-modal";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface MainLayoutProps {
  children: React.ReactNode;
  currentChainId?: string;
}

export default function MainLayout({ children, currentChainId }: MainLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const chain = currentChainId ? getChainConfig(currentChainId) : null;
  
  const { 
    address, 
    isConnected, 
    connect, 
    disconnect, 
    isMetaMaskInstalled,
    isWrongNetwork,
    chainId,
    networkName
  } = useEvmWallet();
  
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      setShowMetaMaskModal(true);
      return;
    }

    setIsConnecting(true);
    try {
      await connect();
      toast({
        title: "Wallet connected",
        description: "Successfully connected to your wallet",
      });
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-[#05080d]">
      {/* Slide-out Menu */}
      <MobileMenu 
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentChainId={currentChainId}
      />

      {/* MetaMask Installation Modal */}
      <MetaMaskInstallModal 
        isOpen={showMetaMaskModal}
        onClose={() => setShowMetaMaskModal(false)}
      />

      {/* Full Width Layout */}
      <div className="w-full">
        {/* Clean Top Header Bar */}
        <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
              data-testid="button-open-menu"
            >
              <Menu className="h-5 w-5 text-gray-300" />
            </button>

            {/* Logo with Animation */}
            <div className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-[#00d4ff] flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" opacity="0.7" />
                </svg>
              </div>
              <span className="text-base font-semibold text-white hidden sm:block">
                AIQX Labs
              </span>
            </div>

            {/* Chain Info - only on chain pages */}
            {chain && (
              <>
                <div className="h-5 w-px bg-gray-700 mx-2 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-2">
                  <chain.icon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">
                    {chain.displayName}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Network Switcher - shows when connected */}
            {isConnected && <NetworkSwitcher />}

            {/* Wrong Network Warning */}
            {isWrongNetwork && (
              <Badge 
                variant="destructive" 
                className="gap-1 animate-pulse hidden sm:flex"
                data-testid="badge-network-warning"
              >
                <AlertCircle className="h-3 w-3" />
                Wrong Network
              </Badge>
            )}

            {/* Wallet Connection Button */}
            {!isConnected ? (
              <Button 
                className="bg-[#00d4ff] hover:bg-[#00b8e6] text-white text-sm font-medium px-4 transition-all hover:scale-105 active:scale-95"
                size="sm"
                onClick={handleConnect}
                disabled={isConnecting}
                data-testid="button-connect-wallet"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 font-mono hover:scale-105 active:scale-95 transition-all"
                    data-testid="button-wallet-menu"
                  >
                    <div className="relative">
                      <Wallet className="h-4 w-4" />
                      <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    {formatAddress(address!)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Connected</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {formatAddress(address!)}
                      </p>
                      {networkName && (
                        <p className="text-xs text-muted-foreground">
                          {networkName}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(address!)}
                    className="cursor-pointer"
                    data-testid="menu-item-copy-address"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Copy Address
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDisconnect}
                    className="cursor-pointer text-destructive"
                    data-testid="menu-item-disconnect"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4 text-gray-400" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}