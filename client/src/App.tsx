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

// Individual Solana Tool Pages
import SolanaMultisender from "@/pages/solana-multisender";
import SolanaTransferAuthority from "@/pages/solana-transfer-authority";
import SolanaRevokeMint from "@/pages/solana-revoke-mint";
import SolanaRevokeFreeze from "@/pages/solana-revoke-freeze";
import SolanaMintTokens from "@/pages/solana-mint-tokens";
import SolanaBurnTokens from "@/pages/solana-burn-tokens";
import SolanaFreezeAccount from "@/pages/solana-freeze-account";
import SolanaUpdateMetadata from "@/pages/solana-update-metadata";

// Legacy pages for backward compatibility
import Solana from "@/pages/create-solana";
import ManageSolana from "@/pages/manage-solana";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      
      {/* Chain-Based Routes */}
      <Route path="/chain/:chainId" component={ChainOverview} />
      <Route path="/chain/:chainId/create" component={ChainCreate} />
      <Route path="/chain/:chainId/manage" component={ChainManage} />
      <Route path="/chain/:chainId/tools" component={ChainTools} />
      
      {/* Individual Solana Tool Routes */}
      <Route path="/solana/multisender" component={SolanaMultisender} />
      <Route path="/solana/transfer-authority" component={SolanaTransferAuthority} />
      <Route path="/solana/revoke-mint" component={SolanaRevokeMint} />
      <Route path="/solana/revoke-freeze" component={SolanaRevokeFreeze} />
      <Route path="/solana/mint-tokens" component={SolanaMintTokens} />
      <Route path="/solana/burn-tokens" component={SolanaBurnTokens} />
      <Route path="/solana/freeze-account" component={SolanaFreezeAccount} />
      <Route path="/solana/update-metadata" component={SolanaUpdateMetadata} />
      
      {/* Legacy routes for backward compatibility */}
      <Route path="/solana" component={Solana} />
      <Route path="/create-solana" component={Solana} />
      <Route path="/manage-solana" component={ManageSolana} />
      
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
