import { useState } from "react";
import { Link, useLocation } from "wouter";
import { CHAIN_DEFINITIONS } from "@/config/chains";
import { 
  Home, X, ChevronRight, ChevronDown, 
  Coins, Shield, Wrench, LayoutGrid, 
  BarChart3, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentChainId?: string;
}

export default function MobileMenu({ isOpen, onClose, currentChainId }: MobileMenuProps) {
  const [location] = useLocation();
  const [blockchainsExpanded, setBlockchainsExpanded] = useState(false);
  const chains = Object.values(CHAIN_DEFINITIONS);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
          data-testid="menu-backdrop"
        />
      )}

      {/* Clean Slide-out Menu */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-out overflow-y-auto shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Menu Header */}
        <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
              <div className="h-8 w-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" opacity="0.7" />
                </svg>
              </div>
              <span className="text-base font-semibold text-gray-900 dark:text-white">AIQX Labs</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            data-testid="button-close-menu"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-3 space-y-1">
          {/* Home */}
          <Link href="/" onClick={onClose}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                location === '/'
                  ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              data-testid="link-home-menu"
            >
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Home</span>
            </div>
          </Link>

          {/* Blockchains Collapsible */}
          <div>
            <button
              onClick={() => setBlockchainsExpanded(!blockchainsExpanded)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              data-testid="button-blockchains"
            >
              <LayoutGrid className="h-5 w-5" />
              <span className="text-sm font-medium flex-1 text-left">Blockchains</span>
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform",
                blockchainsExpanded && "rotate-90"
              )} />
            </button>

            {/* Blockchains Dropdown */}
            {blockchainsExpanded && (
              <div className="mt-1 ml-8 space-y-0.5">
                {chains.map((chain) => {
                  const Icon = chain.icon;
                  const isActive = currentChainId === chain.id;

                  return (
                    <Link key={chain.id} href={`/chain/${chain.id}`} onClick={onClose}>
                      <div
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                          isActive
                            ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        data-testid={`link-chain-${chain.id}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{chain.displayName}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mint */}
          <Link href="/mint" onClick={onClose}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                location === '/mint'
                  ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              data-testid="link-mint-menu"
            >
              <Coins className="h-5 w-5" />
              <span className="text-sm font-medium">Mint Tokens</span>
            </div>
          </Link>

          {/* Revoke */}
          <Link href="/revoke" onClick={onClose}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                location === '/revoke'
                  ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              data-testid="link-revoke-menu"
            >
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Revoke Authorities</span>
            </div>
          </Link>

          {/* Tools */}
          <Link href="/tools" onClick={onClose}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                location === '/tools'
                  ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              data-testid="link-tools-menu"
            >
              <Wrench className="h-5 w-5" />
              <span className="text-sm font-medium">Tools</span>
            </div>
          </Link>

          {/* Dashboard */}
          <Link href="/dashboard" onClick={onClose}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                location === '/dashboard'
                  ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              data-testid="link-dashboard-menu"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </div>
          </Link>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 p-3">
          <div className="flex items-center gap-3 px-3 py-2 text-gray-500 dark:text-gray-400">
            <Settings className="h-4 w-4" />
            <span className="text-xs">Settings</span>
          </div>
        </div>
      </div>
    </>
  );
}
