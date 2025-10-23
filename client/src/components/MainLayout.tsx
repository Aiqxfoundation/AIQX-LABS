import { useState } from "react";
import MobileMenu from "./MobileMenu";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Wallet, Menu, Settings } from "lucide-react";
import { getChainConfig } from "@/config/chains";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  currentChainId?: string;
}

export default function MainLayout({ children, currentChainId }: MainLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const chain = currentChainId ? getChainConfig(currentChainId) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Slide-out Menu */}
      <MobileMenu 
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentChainId={currentChainId}
      />

      {/* Full Width Layout */}
      <div className="w-full">
        {/* Premium Top Header Bar */}
        <div className="h-16 glass-card border-b border-border/50 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-premium backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Premium Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2.5 rounded-xl hover:bg-accent/80 transition-all hover-lift"
              data-testid="button-open-menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Premium Logo */}
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-premium glow-sm">
                <svg className="h-5 w-5 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" opacity="0.7" />
                </svg>
              </div>
              <span className="text-lg font-bold hidden sm:block gradient-text">AIQX Labs</span>
            </div>

            {/* Premium Chain Info */}
            {chain && (
              <>
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent mx-2 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-2.5">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shadow-premium glow-sm transition-all",
                    `bg-gradient-to-br ${chain.gradient}`
                  )}>
                    <chain.icon className="h-5 w-5 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold">{chain.displayName}</h1>
                    <p className="text-xs text-muted-foreground font-medium">{chain.network}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {chain && (
              <Button 
                variant="default" 
                className="gap-2 badge-premium hover-glow shadow-premium px-5 py-2 rounded-xl text-white font-semibold"
                size="sm"
                data-testid="button-connect-wallet"
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:bg-accent/80 rounded-xl transition-all"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <main className="w-full max-w-7xl mx-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
