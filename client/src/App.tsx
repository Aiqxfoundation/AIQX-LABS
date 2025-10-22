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
import Ethereum from "@/pages/ethereum";
import BSC from "@/pages/bsc";
import Polygon from "@/pages/polygon";
import Arbitrum from "@/pages/arbitrum";
import Base from "@/pages/base";
import Solana from "@/pages/create-solana";
import Dashboard from "@/pages/dashboard";
import { Button } from "@/components/ui/button";
import { Hexagon } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ethereum" component={Ethereum} />
      <Route path="/bsc" component={BSC} />
      <Route path="/polygon" component={Polygon} />
      <Route path="/arbitrum" component={Arbitrum} />
      <Route path="/base" component={Base} />
      <Route path="/solana" component={Solana} />
      <Route path="/dashboard" component={Dashboard} />
      {/* Legacy routes for backward compatibility */}
      <Route path="/create" component={Ethereum} />
      <Route path="/create-solana" component={Solana} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Navigation() {
  const [location] = useLocation();
  
  const isBlockchainPage = ['/ethereum', '/bsc', '/polygon', '/arbitrum', '/base', '/solana'].includes(location);
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate px-3 py-2 rounded-md transition-all" data-testid="link-home">
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-polygon rounded-md flex items-center justify-center">
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
          <Link href="/ethereum">
            <Button
              variant={isBlockchainPage ? "secondary" : "ghost"}
              data-testid="link-nav-create"
            >
              Create Token
            </Button>
          </Link>
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
