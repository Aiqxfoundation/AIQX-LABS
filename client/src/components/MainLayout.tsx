import { useState } from "react";
import MobileMenu from "./MobileMenu";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Menu, Settings } from "lucide-react";
import { getChainConfig } from "@/config/chains";

interface MainLayoutProps {
  children: React.ReactNode;
  currentChainId?: string;
}

export default function MainLayout({ children, currentChainId }: MainLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const chain = currentChainId ? getChainConfig(currentChainId) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Slide-out Menu */}
      <MobileMenu 
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentChainId={currentChainId}
      />

      {/* Full Width Layout */}
      <div className="w-full">
        {/* Clean Top Header Bar */}
        <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              data-testid="button-open-menu"
            >
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-cyan-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" opacity="0.7" />
                </svg>
              </div>
              <span className="text-base font-semibold text-gray-900 dark:text-white hidden sm:block">
                AIQX Labs
              </span>
            </div>

            {/* Chain Info - only on chain pages */}
            {chain && (
              <>
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-2 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-2">
                  <chain.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {chain.displayName}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4"
              size="sm"
              data-testid="button-connect-wallet"
            >
              Connect Wallet
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:bg-gray-100 dark:hover:bg-gray-800"
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
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
