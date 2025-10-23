import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { EvmWalletProvider } from "@/contexts/EvmWalletContext";
import { SolanaWalletProvider } from "@/contexts/SolanaWalletContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ChainOverview from "@/pages/chain-overview";
import Dashboard from "@/pages/dashboard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Hexagon, ChevronDown } from "lucide-react";
import { SUPPORTED_CHAINS } from "@/config/chains";

// Import old pages for backward compatibility
import Ethereum from "@/pages/ethereum";
import BSC from "@/pages/bsc";
import Polygon from "@/pages/polygon";
import Arbitrum from "@/pages/arbitrum";
import Base from "@/pages/base";
import Solana from "@/pages/create-solana";
import ManageSolana from "@/pages/manage-solana";
import ToolsSolana from "@/pages/tools-solana";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      
      {/* New Chain-Based Routes */}
      <Route path="/chain/:chainId" component={ChainOverview} />
      <Route path="/chain/:chainId/create" component={(props: any) => {
        const chainId = props.params.chainId;
        // Route to appropriate create page based on chainId
        if (chainId === 'ethereum') return <Ethereum />;
        if (chainId === 'bsc') return <BSC />;
        if (chainId === 'polygon') return <Polygon />;
        if (chainId === 'arbitrum') return <Arbitrum />;
        if (chainId === 'base') return <Base />;
        if (chainId === 'solana') return <Solana />;
        return <NotFound />;
      }} />
      <Route path="/chain/:chainId/manage" component={(props: any) => {
        const chainId = props.params.chainId;
        // For now, only Solana has a manage page
        if (chainId === 'solana') return <ManageSolana />;
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">Token management for {chainId} is coming soon!</p>
        </div>;
      }} />
      <Route path="/chain/:chainId/tools" component={(props: any) => {
        const chainId = props.params.chainId;
        // For now, only Solana has a tools page
        if (chainId === 'solana') return <ToolsSolana />;
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">Advanced tools for {chainId} are coming soon!</p>
        </div>;
      }} />
      
      {/* Legacy routes for backward compatibility */}
      <Route path="/ethereum" component={Ethereum} />
      <Route path="/bsc" component={BSC} />
      <Route path="/polygon" component={Polygon} />
      <Route path="/arbitrum" component={Arbitrum} />
      <Route path="/base" component={Base} />
      <Route path="/solana" component={Solana} />
      <Route path="/create" component={Ethereum} />
      <Route path="/create-solana" component={Solana} />
      <Route path="/manage-solana" component={ManageSolana} />
      <Route path="/tools-solana" component={ToolsSolana} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function Navigation() {
  const [location] = useLocation();
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 px-3 py-2 rounded-md transition-all" data-testid="link-home">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <Hexagon className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">AIQX Labs</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button
              variant={location === "/" ? "secondary" : "ghost"}
              data-testid="link-nav-home"
            >
              Home
            </Button>
          </Link>
          
          {/* Blockchains Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={location.startsWith("/chain/") ? "secondary" : "ghost"}
                className="gap-1"
                data-testid="dropdown-blockchains"
              >
                Blockchains
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Select Blockchain</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SUPPORTED_CHAINS.map((chain) => {
                const IconComponent = chain.icon;
                return (
                  <Link key={chain.id} href={chain.routes.overview}>
                    <DropdownMenuItem 
                      className="cursor-pointer gap-3"
                      data-testid={`dropdown-item-${chain.id}`}
                    >
                      <div 
                        className={`h-8 w-8 rounded-lg bg-gradient-to-br ${chain.gradient} p-0.5 flex-shrink-0`}
                      >
                        <div className="h-full w-full rounded-lg bg-card flex items-center justify-center">
                          <IconComponent className="h-4 w-4" style={{ color: chain.color }} />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{chain.displayName}</span>
                        <span className="text-xs text-muted-foreground">{chain.network}</span>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/dashboard">
            <Button
              variant={location === "/dashboard" ? "secondary" : "ghost"}
              data-testid="link-nav-dashboard"
            >
              Dashboard
            </Button>
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <EvmWalletProvider>
            <SolanaWalletProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Navigation />
                <Router />
              </div>
              <Toaster />
            </SolanaWalletProvider>
          </EvmWalletProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
