import { Link, useLocation } from "wouter";
import { CHAIN_DEFINITIONS } from "@/config/chains";
import { Home, Coins, Settings, Send, Lock, Zap, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentChainId?: string;
}

export default function Sidebar({ currentChainId }: SidebarProps) {
  const [location] = useLocation();

  const chains = Object.values(CHAIN_DEFINITIONS);
  
  const toolCategories = currentChainId ? [
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
      name: "Multisender",
      icon: Send,
      href: `/chain/${currentChainId}/tools`,
      available: currentChainId !== 'solana',
    },
    {
      name: "Advanced Tools",
      icon: Zap,
      href: `/chain/${currentChainId}/tools`,
      available: currentChainId === 'solana',
    },
    {
      name: "Token Locker",
      icon: Lock,
      href: `/chain/${currentChainId}/tools#locker`,
      available: false,
      comingSoon: true,
    },
  ] : [];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto">
      {/* Logo */}
      <Link href="/">
        <div className="p-6 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors" data-testid="link-home">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AIQX Labs</h1>
              <p className="text-xs text-slate-400">Multi-Chain Tools</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Blockchains Section */}
      <div className="p-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Blockchains
        </h3>
        <div className="space-y-1">
          {chains.map((chain) => {
            const Icon = chain.icon;
            const isActive = currentChainId === chain.id;
            
            return (
              <Link key={chain.id} href={`/chain/${chain.id}`}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                  data-testid={`link-chain-${chain.id}`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{chain.displayName}</span>
                  <span className={cn(
                    "ml-auto text-xs px-2 py-0.5 rounded-full",
                    isActive ? "bg-blue-700" : "bg-slate-700"
                  )}>
                    {chain.tools.filter(t => t.available).length}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tools Section - Only show when a chain is selected */}
      {currentChainId && (
        <div className="p-4 border-t border-slate-800">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Tools
          </h3>
          <div className="space-y-1">
            {toolCategories.map((tool) => {
              const Icon = tool.icon;
              const isActive = location === tool.href || location.startsWith(tool.href);
              
              if (!tool.available && !tool.comingSoon) return null;
              
              return (
                <Link key={tool.name} href={tool.available ? tool.href : '#'}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                      tool.available
                        ? isActive
                          ? "bg-slate-800 text-white"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
                        : "text-slate-600 cursor-not-allowed opacity-50"
                    )}
                    data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{tool.name}</span>
                    {tool.comingSoon && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">
                        Soon
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Dashboard Link */}
      <div className="mt-auto p-4 border-t border-slate-800">
        <Link href="/dashboard">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
              location === '/dashboard'
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
            data-testid="link-dashboard"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
