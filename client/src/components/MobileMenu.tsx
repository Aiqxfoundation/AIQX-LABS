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
      {/* Premium Backdrop with Blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={onClose}
          data-testid="menu-backdrop"
        />
      )}

      {/* Premium Slide-out Menu */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-80 glass-card border-r border-border/50 z-50 transform transition-all duration-300 ease-out overflow-y-auto shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Premium Menu Header */}
        <div className="h-16 border-b border-border/50 flex items-center justify-between px-5 bg-gradient-to-r from-primary/5 to-transparent">
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-all group" data-testid="link-home">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-premium glow-sm group-hover:scale-105 transition-transform">
                <svg className="h-5 w-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" opacity="0.7" />
                </svg>
              </div>
              <span className="text-lg font-bold gradient-text">AIQX Labs</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-accent/80 transition-all hover-lift"
            data-testid="button-close-menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-5 space-y-6">
          {/* Home */}
          <Link href="/" onClick={onClose}>
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all hover-lift",
                location === '/'
                  ? "glass-card gradient-border shadow-premium"
                  : "hover:bg-accent/50"
              )}
              data-testid="link-home-menu"
            >
              <div className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
                location === '/' ? "badge-premium glow-sm" : "bg-accent/30"
              )}>
                <Home className="h-4 w-4" style={{ color: location === '/' ? 'white' : undefined }} />
              </div>
              <span className="text-sm font-semibold">Home</span>
            </div>
          </Link>

          {/* Premium Blockchains Section */}
          <div>
            <div className="flex items-center gap-2 mb-4 px-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                Blockchains
              </h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
            </div>
            <div className="space-y-1.5">
              {chains.map((chain) => {
                const Icon = chain.icon;
                const isActive = currentChainId === chain.id;

                return (
                  <Link key={chain.id} href={`/chain/${chain.id}`} onClick={onClose}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group",
                        isActive
                          ? "glass-card gradient-border shadow-premium"
                          : "hover:bg-accent/50 hover-lift"
                      )}
                      data-testid={`link-chain-${chain.id}`}
                    >
                      <div className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                        isActive ? `bg-gradient-to-br ${chain.gradient} shadow-premium glow-sm` : "bg-accent/30 group-hover:bg-accent"
                      )}>
                        <Icon className="h-4 w-4" style={{ color: isActive ? 'white' : chain.color }} />
                      </div>
                      <span className="text-sm font-semibold flex-1">{chain.displayName}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Current Chain Tools */}
          {currentChain && (
            <div>
              <div className="flex items-center gap-2 mb-4 px-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/30" />
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  {currentChain.displayName} Tools
                </h3>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/30" />
              </div>
              <div className="space-y-1.5">
                {toolCategories.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = location === tool.href || (tool.href !== '#' && location.startsWith(tool.href));

                  if (!tool.available) {
                    return (
                      <div
                        key={tool.name}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl opacity-50 cursor-not-allowed glass-light"
                        data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground flex-1">{tool.name}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">Soon</span>
                      </div>
                    );
                  }

                  return (
                    <Link key={tool.name} href={tool.href} onClick={onClose}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                          isActive
                            ? "glass-card gradient-border shadow-premium"
                            : "hover:bg-accent/50 hover-lift"
                        )}
                        data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className={cn(
                          "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
                          isActive ? "badge-premium glow-sm" : "bg-accent/30"
                        )}>
                          <Icon className="h-4 w-4" style={{ color: isActive ? 'white' : undefined }} />
                        </div>
                        <span className="text-sm font-semibold">{tool.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Premium Dashboard */}
          {currentChain && (
            <div className="border-t border-border/30 pt-5">
              <Link href="/dashboard" onClick={onClose}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all",
                    location === '/dashboard'
                      ? "glass-card gradient-border shadow-premium"
                      : "hover:bg-accent/50 hover-lift"
                  )}
                  data-testid="link-dashboard-menu"
                >
                  <div className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
                    location === '/dashboard' ? "badge-premium glow-sm" : "bg-accent/30"
                  )}>
                    <Home className="h-4 w-4" style={{ color: location === '/dashboard' ? 'white' : undefined }} />
                  </div>
                  <span className="text-sm font-semibold">Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
