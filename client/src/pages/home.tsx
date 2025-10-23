import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, Send, Lock, Settings, Plus, Flame, Snowflake, UserPlus, UserX, ArrowRight, Sparkles } from "lucide-react";
import { SUPPORTED_CHAINS } from "@/config/chains";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative py-20 md:py-32 px-6 overflow-hidden">
        {/* Premium Gradient Mesh Background */}
        <div className="absolute inset-0 gradient-mesh-dark opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border) / 0.3) 0.5px, transparent 0)`,
          backgroundSize: '48px 48px',
          opacity: 0.4
        }} />
        
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full badge-premium text-white text-sm font-semibold mb-8 glow-sm fade-in-up">
            <Sparkles className="h-4 w-4" />
            Multi-Chain Token Platform
          </div>
          
          {/* Hero Title with Gradient */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 dark:from-white dark:via-blue-100 dark:to-purple-200 bg-clip-text text-transparent">
              Tokens & Tools with Ease
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 fade-in-up" style={{ animationDelay: '0.2s' }}>
            Launch tokens, manage liquidity, and use advanced tools across multiple blockchains. Effortless and without coding.
          </p>
        </div>
      </section>

      {/* Premium Blockchain Selector */}
      <section className="py-16 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm uppercase tracking-wider text-primary font-bold mb-3 flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
              SELECT YOUR BLOCKCHAIN
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary" />
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose your blockchain to access creation and management tools
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {SUPPORTED_CHAINS.map((chain, index) => {
              const IconComponent = chain.icon;
              return (
                <Link key={chain.id} href={chain.routes.overview}>
                  <div 
                    className="card-premium group relative p-6 cursor-pointer hover-lift rounded-2xl fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    data-testid={`card-blockchain-${chain.id}`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      {/* Premium Icon with Glow */}
                      <div 
                        className={`relative h-20 w-20 rounded-2xl bg-gradient-to-br ${chain.gradient} p-1 group-hover:scale-110 transition-all duration-300 shadow-premium hover-glow`}
                      >
                        <div className="h-full w-full rounded-2xl bg-card/90 backdrop-blur-sm flex items-center justify-center">
                          <IconComponent className="h-10 w-10 text-white drop-shadow-lg" style={{ color: chain.color }} />
                        </div>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                          style={{
                            background: `radial-gradient(circle at center, ${chain.color}40 0%, transparent 70%)`,
                            filter: 'blur(10px)',
                            zIndex: -1
                          }}
                        />
                      </div>
                      
                      {/* Chain Info */}
                      <div className="text-center">
                        <div className="text-base font-bold group-hover:gradient-text transition-all">
                          {chain.displayName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1.5 font-medium">
                          {chain.network}
                        </div>
                      </div>
                    </div>
                    
                    {/* Premium Badge with Glow */}
                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full badge-premium text-white text-xs font-bold flex items-center justify-center glow-sm">
                      {chain.tools.filter(t => t.available).length}
                    </div>

                    {/* Hover Border Glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
                      style={{
                        background: `linear-gradient(135deg, ${chain.color}20, transparent)`,
                        border: `1px solid ${chain.color}40`
                      }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              <span className="gradient-text">Our Most Outstanding Features</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional tools for token creation and management across multiple blockchains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Token Creator */}
            <div className="card-premium group p-8 cursor-pointer rounded-2xl hover-lift">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-all shadow-premium glow-sm">
                <Coins className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:gradient-text transition-all">Token Creator</h3>
              <p className="text-muted-foreground mb-5 leading-relaxed">
                Create custom tokens without coding within 2 minutes. Support for ERC20, BEP20, and SPL tokens.
              </p>
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                Available on all chains
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Multisender */}
            <div className="card-premium group p-8 cursor-pointer rounded-2xl hover-lift">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-all shadow-premium glow-sm">
                <Send className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:gradient-text transition-all">Multisender</h3>
              <p className="text-muted-foreground mb-5 leading-relaxed">
                Make airdrops of tokens to a list of wallets with ease. Save time and transaction fees.
              </p>
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                Available on Solana
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Token Management */}
            <div className="card-premium group p-8 cursor-pointer rounded-2xl hover-lift">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-all shadow-premium glow-sm">
                <Settings className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:gradient-text transition-all">Token Management</h3>
              <p className="text-muted-foreground mb-5 leading-relaxed">
                View and manage all your deployed tokens across multiple blockchains from one dashboard.
              </p>
              <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                Available on all chains
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Authority Management */}
            <div className="card-premium group p-8 cursor-pointer rounded-2xl hover-lift">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-all shadow-premium glow-sm">
                <UserPlus className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:gradient-text transition-all">Authority Control</h3>
              <p className="text-muted-foreground mb-5 leading-relaxed">
                Transfer or revoke mint and freeze authorities. Full control over your token permissions.
              </p>
              <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm">
                Available on Solana
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Mint & Burn */}
            <div className="card-premium group p-8 cursor-pointer rounded-2xl hover-lift">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-all shadow-premium glow-sm">
                <Flame className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:gradient-text transition-all">Mint & Burn</h3>
              <p className="text-muted-foreground mb-5 leading-relaxed">
                Mint additional tokens or burn existing ones to manage your token supply dynamically.
              </p>
              <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                Available on Solana
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Freeze Accounts */}
            <div className="card-premium group p-8 cursor-pointer rounded-2xl hover-lift">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-all shadow-premium glow-sm">
                <Snowflake className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:gradient-text transition-all">Freeze & Unfreeze</h3>
              <p className="text-muted-foreground mb-5 leading-relaxed">
                Freeze or unfreeze token accounts for compliance and security purposes.
              </p>
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                Available on Solana
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="glass-card p-8 rounded-2xl hover-glow transition-all">
              <div className="text-6xl font-bold mb-3 gradient-text">
                6
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                Blockchains
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl hover-glow transition-all">
              <div className="text-6xl font-bold mb-3 gradient-text">
                9+
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                Tools Available
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl hover-glow transition-all">
              <div className="text-6xl font-bold mb-3 gradient-text">
                100%
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                No Coding Required
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl hover-glow transition-all">
              <div className="text-6xl font-bold mb-3 gradient-text">
                Fast
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                Deploy in Minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 gradient-mesh-dark opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Ready to Launch Your Token?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Choose your blockchain and start creating professional tokens in minutes
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/chain/solana">
              <Button size="lg" className="gap-2 text-lg px-10 py-6 rounded-xl badge-premium hover-glow transition-all shadow-premium" data-testid="button-start-solana">
                Start with Solana
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/chain/ethereum">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-10 py-6 rounded-xl glass-card hover-glow transition-all" data-testid="button-start-ethereum">
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
