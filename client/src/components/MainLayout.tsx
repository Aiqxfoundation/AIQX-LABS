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
        {/* Top Header Bar */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              data-testid="button-open-menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo - visible on all pages */}
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" opacity="0.7" />
                </svg>
              </div>
              <span className="text-lg font-bold hidden sm:block">AIQX Labs</span>
            </div>

            {/* Chain Info - only on chain pages */}
            {chain && (
              <>
                <div className="h-6 w-px bg-border mx-2 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-2">
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center",
                    `bg-gradient-to-br ${chain.gradient}`
                  )}>
                    <chain.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold">{chain.displayName}</h1>
                    <p className="text-xs text-muted-foreground">{chain.network}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {chain && (
              <Button 
                variant="default" 
                className="gap-2"
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
              className="hidden sm:flex"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content - Full width, fits screen */}
        <main className="w-full max-w-7xl mx-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
