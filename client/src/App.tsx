import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { EvmWalletProvider } from "@/contexts/EvmWalletContext";
import { SolanaWalletProvider } from "@/contexts/SolanaWalletContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ChainOverview from "@/pages/chain-overview";
import ChainCreate from "@/pages/chain-create";
import ChainManage from "@/pages/chain-manage";
import ChainTools from "@/pages/chain-tools";

// Lazy load Solana pages to avoid loading heavy dependencies upfront
const SolanaMultisender = lazy(() => import("@/pages/solana-multisender"));
const SolanaTransferAuthority = lazy(() => import("@/pages/solana-transfer-authority"));
const SolanaRevokeMint = lazy(() => import("@/pages/solana-revoke-mint"));
const SolanaRevokeFreeze = lazy(() => import("@/pages/solana-revoke-freeze"));
const SolanaMintTokens = lazy(() => import("@/pages/solana-mint-tokens"));
const SolanaBurnTokens = lazy(() => import("@/pages/solana-burn-tokens"));
const SolanaFreezeAccount = lazy(() => import("@/pages/solana-freeze-account"));
const SolanaUpdateMetadata = lazy(() => import("@/pages/solana-update-metadata"));

// Loading component
function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Switch>
        <Route path="/" component={Home} />
        
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
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <TransactionProvider>
            <EvmWalletProvider>
              <SolanaWalletProvider>
                <Router />
                <Toaster />
              </SolanaWalletProvider>
            </EvmWalletProvider>
          </TransactionProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
