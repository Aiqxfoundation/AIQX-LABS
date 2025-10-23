import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, Send, Lock, Settings, Plus, Flame, Snowflake, UserPlus, UserX, ArrowRight, Sparkles } from "lucide-react";
import { SUPPORTED_CHAINS } from "@/config/chains";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 0.5px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 0.3
        }} />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4" />
            Multi-Chain Token Platform
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Tokens & Tools with Ease
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Launch tokens, manage liquidity, and use advanced tools across multiple blockchains. Effortless and without coding.
          </p>
        </div>
      </section>

      {/* Blockchain Selector */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-sm uppercase tracking-wide text-muted-foreground font-semibold mb-2">
              SELECT YOUR BLOCKCHAIN
            </h2>
            <p className="text-muted-foreground">
              Choose your blockchain to access creation and management tools
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SUPPORTED_CHAINS.map((chain) => {
              const IconComponent = chain.icon;
              return (
                <Link key={chain.id} href={chain.routes.overview}>
                  <Card 
                    className="group relative p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
                    data-testid={`card-blockchain-${chain.id}`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div 
                        className={`h-16 w-16 rounded-xl bg-gradient-to-br ${chain.gradient} p-0.5 group-hover:scale-110 transition-transform shadow-lg`}
                      >
                        <div className="h-full w-full rounded-xl bg-card flex items-center justify-center">
                          <IconComponent className="h-8 w-8 text-white" style={{ color: chain.color }} />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold group-hover:text-primary transition-colors">
                          {chain.displayName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {chain.network}
                        </div>
                      </div>
                    </div>
                    
                    {/* Available Tools Count Badge */}
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg">
                      {chain.tools.filter(t => t.available).length}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Most Outstanding Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional tools for token creation and management across multiple blockchains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Token Creator */}
            <Card className="group p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/50">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Coins className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Token Creator</h3>
              <p className="text-muted-foreground mb-4">
                Create custom tokens without coding within 2 minutes. Support for ERC20, BEP20, and SPL tokens.
              </p>
              <div className="flex items-center gap-2 text-primary font-medium text-sm">
                Available on all chains
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            {/* Multisender */}
            <Card className="group p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/50">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Send className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multisender</h3>
              <p className="text-muted-foreground mb-4">
                Make airdrops of tokens to a list of wallets with ease. Save time and transaction fees.
              </p>
              <div className="flex items-center gap-2 text-purple-500 font-medium text-sm">
                Available on Solana
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            {/* Token Management */}
            <Card className="group p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/50">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Settings className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Token Management</h3>
              <p className="text-muted-foreground mb-4">
                View and manage all your deployed tokens across multiple blockchains from one dashboard.
              </p>
              <div className="flex items-center gap-2 text-green-500 font-medium text-sm">
                Available on all chains
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            {/* Authority Management */}
            <Card className="group p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/50">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UserPlus className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Authority Control</h3>
              <p className="text-muted-foreground mb-4">
                Transfer or revoke mint and freeze authorities. Full control over your token permissions.
              </p>
              <div className="flex items-center gap-2 text-orange-500 font-medium text-sm">
                Available on Solana
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            {/* Mint & Burn */}
            <Card className="group p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/50">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Flame className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mint & Burn</h3>
              <p className="text-muted-foreground mb-4">
                Mint additional tokens or burn existing ones to manage your token supply dynamically.
              </p>
              <div className="flex items-center gap-2 text-red-500 font-medium text-sm">
                Available on Solana
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>

            {/* Freeze Accounts */}
            <Card className="group p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/50">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Snowflake className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Freeze & Unfreeze</h3>
              <p className="text-muted-foreground mb-4">
                Freeze or unfreeze token accounts for compliance and security purposes.
              </p>
              <div className="flex items-center gap-2 text-cyan-500 font-medium text-sm">
                Available on Solana
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                6
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                Blockchains
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                9+
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                Tools Available
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                No Coding Required
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Fast
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                Deploy in Minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Launch Your Token?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Choose your blockchain and start creating professional tokens in minutes
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/chain/solana">
              <Button size="lg" className="gap-2 text-lg px-8" data-testid="button-start-solana">
                Start with Solana
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/chain/ethereum">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8" data-testid="button-start-ethereum">
                Start with Ethereum
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
