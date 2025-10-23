import { useState } from "react";
import Sidebar from "./Sidebar";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import { getChainConfig } from "@/config/chains";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  currentChainId?: string;
}

export default function MainLayout({ children, currentChainId }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const chain = currentChainId ? getChainConfig(currentChainId) : null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        currentChainId={currentChainId} 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      
      {/* Fixed width content - no resize on sidebar toggle */}
      <div className="ml-64">
        {/* Top Header Bar with Chain Info and Wallet */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            {chain && (
              <>
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  `bg-gradient-to-br ${chain.gradient}`
                )}>
                  <chain.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold">{chain.displayName}</h1>
                  <p className="text-xs text-muted-foreground">{chain.network}</p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {chain && (
              <Button 
                variant="default" 
                className="gap-2 shadow-md"
                data-testid="button-connect-wallet"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content - Full width, no resize */}
        <main className="p-6 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
