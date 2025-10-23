import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { EvmWalletProvider } from "@/contexts/EvmWalletContext";
import { SolanaWalletProvider } from "@/contexts/SolanaWalletContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ChainOverview from "@/pages/chain-overview";
import ChainCreate from "@/pages/chain-create";
import ChainManage from "@/pages/chain-manage";
import ChainTools from "@/pages/chain-tools";
import Dashboard from "@/pages/dashboard";
import Mint from "@/pages/mint";
import Revoke from "@/pages/revoke";
import Tools from "@/pages/tools";

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
      
      {/* New dedicated pages */}
      <Route path="/mint" component={Mint} />
      <Route path="/revoke" component={Revoke} />
      <Route path="/tools" component={Tools} />
      
      {/* New Chain-Based Routes */}
      <Route path="/chain/:chainId" component={ChainOverview} />
      <Route path="/chain/:chainId/create" component={ChainCreate} />
      <Route path="/chain/:chainId/manage" component={ChainManage} />
      <Route path="/chain/:chainId/tools" component={ChainTools} />
      
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <EvmWalletProvider>
            <SolanaWalletProvider>
              <Router />
              <Toaster />
            </SolanaWalletProvider>
          </EvmWalletProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
