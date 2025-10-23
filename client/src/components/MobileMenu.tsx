import { Link, useLocation } from "wouter";
import { CHAIN_DEFINITIONS, getChainConfig } from "@/config/chains";
import { Home, X, ChevronRight, Coins, Settings, Send, Lock, LayoutGrid, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentChainId?: string;
}

export default function MobileMenu({ isOpen, onClose, currentChainId }: MobileMenuProps) {
  const [location] = useLocation();
  const chains = Object.values(CHAIN_DEFINITIONS);
  const currentChain = currentChainId ? getChainConfig(currentChainId) : null;

  const toolCategories = currentChainId ? [
    {
      name: "Overview",
      icon: LayoutGrid,
      href: `/chain/${currentChainId}`,
      available: true,
    },
    {
      name: "Token Creator",
      icon: Coins,
      href: `/chain/${currentChainId}/create`,
      available: true,
    },
    {
      name: "Manage Tokens",
      icon: Settings,
      href: `/chain/${currentChainId}/manage`,
      available: true,
    },
    {
      name: currentChainId === 'solana' ? "Advanced Tools" : "Multisender",
      icon: currentChainId === 'solana' ? Zap : Send,
      href: `/chain/${currentChainId}/tools`,
      available: true,
    },
    {
      name: "Token Locker",
      icon: Lock,
      href: '#',
      available: false,
    },
  ] : [];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          data-testid="menu-backdrop"
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-background border-r border-border z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Menu Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" data-testid="link-home">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" opacity="0.7" />
                </svg>
              </div>
              <span className="text-lg font-bold">AIQX Labs</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            data-testid="button-close-menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-6">
          {/* Home */}
          <Link href="/" onClick={onClose}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                location === '/'
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              )}
              data-testid="link-home-menu"
            >
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Home</span>
            </div>
          </Link>

          {/* Blockchains Section */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Blockchains
            </h3>
            <div className="space-y-1">
              {chains.map((chain) => {
                const Icon = chain.icon;
                const isActive = currentChainId === chain.id;

                return (
                  <Link key={chain.id} href={`/chain/${chain.id}`} onClick={onClose}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all group",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      )}
                      data-testid={`link-chain-${chain.id}`}
                    >
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        isActive ? "bg-primary/10" : "bg-accent/50 group-hover:bg-accent"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium flex-1">{chain.displayName}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Current Chain Tools - Only show when on a chain page */}
          {currentChain && (
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                {currentChain.displayName} Tools
              </h3>
              <div className="space-y-1">
                {toolCategories.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = location === tool.href || (tool.href !== '#' && location.startsWith(tool.href));

                  if (!tool.available) {
                    return (
                      <div
                        key={tool.name}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-50 cursor-not-allowed"
                        data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="h-8 w-8 rounded-lg bg-accent/30 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground flex-1">{tool.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500">Soon</span>
                      </div>
                    );
                  }

                  return (
                    <Link key={tool.name} href={tool.href} onClick={onClose}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        )}
                        data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center",
                          isActive ? "bg-primary/10" : "bg-accent/50"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">{tool.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dashboard */}
          <div className={currentChain ? "border-t border-border pt-4" : ""}>
            <Link href="/dashboard" onClick={onClose}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                  location === '/dashboard'
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
                data-testid="link-dashboard-menu"
              >
                <div className="h-8 w-8 rounded-lg bg-accent/50 flex items-center justify-center">
                  <Home className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Dashboard</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
