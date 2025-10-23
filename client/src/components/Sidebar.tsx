import { useState } from "react";
import { Link, useLocation } from "wouter";
import { CHAIN_DEFINITIONS } from "@/config/chains";
import { Home, Coins, Settings, Send, Lock, Zap, Layers, Menu, X, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentChainId?: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ currentChainId, isCollapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const chains = Object.values(CHAIN_DEFINITIONS);
  
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
      comingSoon: true,
    },
  ] : [];

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col transition-all duration-300 z-40 shadow-lg",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with Toggle */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-gradient-to-r from-primary/10 to-purple-500/10">
        {!isCollapsed && (
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" data-testid="link-home">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AIQX Labs
              </span>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
              <Layers className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
          data-testid="button-toggle-sidebar"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Blockchains Section */}
        <div className="p-4">
          {!isCollapsed && (
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              Blockchains
            </h3>
          )}
          <div className="space-y-1">
            {chains.map((chain) => {
              const Icon = chain.icon;
              const isActive = currentChainId === chain.id;
              
              return (
                <Link key={chain.id} href={`/chain/${chain.id}`}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all group",
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-accent/50 hover:shadow-sm"
                    )}
                    data-testid={`link-chain-${chain.id}`}
                    title={isCollapsed ? chain.displayName : undefined}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                      isActive ? "bg-white/20" : "bg-accent group-hover:bg-accent-foreground/10"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className="text-sm font-semibold truncate flex-1">{chain.displayName}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          isActive ? "bg-white/20" : "bg-primary/10 text-primary"
                        )}>
                          {chain.tools.filter(t => t.available).length}
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tools Section - Only show when a chain is selected */}
        {currentChainId && (
          <div className="p-4 border-t border-border">
            {!isCollapsed && (
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                Tools
              </h3>
            )}
            <div className="space-y-1">
              {toolCategories.map((tool) => {
                const Icon = tool.icon;
                const isActive = location === tool.href || (tool.href !== '#' && location.startsWith(tool.href + '/'));
                
                if (!tool.available && !tool.comingSoon) return null;
                
                const content = (
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                      tool.available
                        ? isActive
                          ? "bg-accent text-accent-foreground shadow-sm"
                          : "text-foreground hover:bg-accent/50 cursor-pointer"
                        : "text-muted-foreground cursor-not-allowed opacity-50"
                    )}
                    data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                    title={isCollapsed ? tool.name : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="text-sm font-medium truncate flex-1">{tool.name}</span>
                        {tool.comingSoon && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 font-medium">
                            Soon
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
                
                return tool.available ? (
                  <Link key={tool.name} href={tool.href}>
                    {content}
                  </Link>
                ) : (
                  <div key={tool.name}>{content}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Link */}
      <div className="p-4 border-t border-border mt-auto">
        <Link href="/dashboard">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
              location === '/dashboard'
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-foreground hover:bg-accent/50"
            )}
            data-testid="link-dashboard"
            title={isCollapsed ? "Dashboard" : undefined}
          >
            <Home className="h-4 w-4" />
            {!isCollapsed && <span className="text-sm font-semibold">Dashboard</span>}
          </div>
        </Link>
      </div>
    </div>
  );
}
