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
        "fixed left-0 top-0 h-full bg-background border-r border-border flex flex-col transition-all duration-300 z-40",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      {/* Header with Toggle */}
      <div className="h-14 border-b border-border flex items-center justify-between px-3">
        {!isCollapsed && (
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" data-testid="link-home">
              <div className="h-7 w-7 rounded bg-primary flex items-center justify-center">
                <Layers className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold">AIQX Labs</span>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="h-7 w-7 rounded bg-primary flex items-center justify-center">
              <Layers className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded hover:bg-accent transition-colors"
          data-testid="button-toggle-sidebar"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Blockchains Section */}
        <div className="p-3">
          {!isCollapsed && (
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Blockchains
            </h3>
          )}
          <div className="space-y-0.5">
            {chains.map((chain) => {
              const Icon = chain.icon;
              const isActive = currentChainId === chain.id;
              
              return (
                <Link key={chain.id} href={`/chain/${chain.id}`}>
                  <div
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all text-sm",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent"
                    )}
                    data-testid={`link-chain-${chain.id}`}
                    title={isCollapsed ? chain.displayName : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="text-xs font-medium truncate">{chain.displayName}</span>
                        <span className={cn(
                          "ml-auto text-[10px] px-1.5 py-0.5 rounded-full",
                          isActive ? "bg-primary-foreground/20" : "bg-muted"
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
          <div className="p-3 border-t border-border">
            {!isCollapsed && (
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Tools
              </h3>
            )}
            <div className="space-y-0.5">
              {toolCategories.map((tool) => {
                const Icon = tool.icon;
                const isActive = location === tool.href || (tool.href !== '#' && location.startsWith(tool.href + '/'));
                
                if (!tool.available && !tool.comingSoon) return null;
                
                const content = (
                  <div
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md transition-all text-sm",
                      tool.available
                        ? isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent cursor-pointer"
                        : "text-muted-foreground cursor-not-allowed opacity-60"
                    )}
                    data-testid={`link-tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                    title={isCollapsed ? tool.name : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="text-xs truncate">{tool.name}</span>
                        {tool.comingSoon && (
                          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
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
      <div className="p-3 border-t border-border mt-auto">
        <Link href="/dashboard">
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all text-sm",
              location === '/dashboard'
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-accent"
            )}
            data-testid="link-dashboard"
            title={isCollapsed ? "Dashboard" : undefined}
          >
            <Home className="h-4 w-4" />
            {!isCollapsed && <span className="text-xs font-medium">Dashboard</span>}
          </div>
        </Link>
      </div>
    </div>
  );
}
