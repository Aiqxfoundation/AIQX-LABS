import { useParams, Link } from "wouter";
import MainLayout from "@/components/MainLayout";
import { getChainConfig } from "@/config/chains";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Send, Lock, Settings, Plus, Flame, Snowflake, UserPlus, UserX, ArrowRight, CheckCircle2, Clock } from "lucide-react";

const iconMap: Record<string, any> = {
  'Coins': Coins,
  'Send': Send,
  'Lock': Lock,
  'Settings': Settings,
  'Plus': Plus,
  'Flame': Flame,
  'Snowflake': Snowflake,
  'UserPlus': UserPlus,
  'UserX': UserX,
};

export default function ChainOverview() {
  const params = useParams();
  const chainId = params.chainId as string;
  const chain = getChainConfig(chainId);

  if (!chain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-premium p-10 text-center max-w-md rounded-2xl">
          <h2 className="text-3xl font-bold mb-3 gradient-text">Blockchain Not Found</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            The blockchain you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button size="lg" className="badge-premium hover-glow" data-testid="button-back-home">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const availableTools = chain.tools.filter(t => t.available);
  const comingSoonTools = chain.tools.filter(t => t.comingSoon);

  return (
    <MainLayout currentChainId={chainId}>
      <div className="space-y-8">

        {/* Premium Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium p-6 rounded-2xl hover-glow transition-all fade-in-up">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-premium glow-sm">
                <CheckCircle2 className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text">{availableTools.length}</div>
                <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Tools Available</div>
              </div>
            </div>
          </div>

          <div className="card-premium p-6 rounded-2xl hover-glow transition-all fade-in-up" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-premium glow-sm">
                <Coins className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text">2 min</div>
                <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Deploy Time</div>
              </div>
            </div>
          </div>

          <div className="card-premium p-6 rounded-2xl hover-glow transition-all fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-premium glow-sm">
                <Clock className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text">{comingSoonTools.length}</div>
                <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Tools Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold gradient-text">Available Tools</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTools.map((tool, index) => {
              const IconComponent = iconMap[tool.icon] || Coins;
              return (
                <Link key={tool.id} href={tool.route}>
                  <div 
                    className="card-premium group p-6 transition-all cursor-pointer rounded-2xl hover-lift fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    data-testid={`card-tool-${tool.id}`}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${chain.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-premium glow-sm`}>
                        <IconComponent className="h-8 w-8 text-white drop-shadow-lg" />
                      </div>
                      <div className="badge-premium text-white border-0 text-xs font-bold px-3 py-1.5 rounded-full shadow-premium">
                        Available
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">
                      {tool.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary text-sm font-bold">
                      Launch Tool
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Coming Soon Tools */}
        {comingSoonTools.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-2xl font-bold gradient-text">Coming Soon</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-orange-500/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonTools.map((tool, index) => {
                const IconComponent = iconMap[tool.icon] || Coins;
                return (
                  <div 
                    key={tool.id}
                    className="glass-card p-6 border border-border/30 opacity-70 cursor-not-allowed relative overflow-hidden rounded-2xl fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    data-testid={`card-tool-${tool.id}`}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-5">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${chain.gradient} opacity-40 flex items-center justify-center shadow-md`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold px-3 py-1.5 rounded-full">
                          Coming Soon
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-3 text-muted-foreground">
                        {tool.name}
                      </h4>
                      <p className="text-sm text-muted-foreground/60 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Premium CTA Card */}
        <div className="card-premium p-10 relative overflow-hidden rounded-2xl hover-glow transition-all">
          <div className="absolute inset-0 gradient-mesh-dark opacity-30" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-3 gradient-text">
                Ready to Get Started?
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Create your first token on {chain.displayName} in just a few clicks
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <Link href={chain.routes.create}>
                <Button size="lg" className="gap-2 px-8 py-6 text-base badge-premium hover-glow shadow-premium rounded-xl" data-testid="button-create-token">
                  <Coins className="h-5 w-5" />
                  Create Token
                </Button>
              </Link>
              <Link href={chain.routes.manage}>
                <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-base glass-card hover-glow rounded-xl" data-testid="button-manage-tokens">
                  <Settings className="h-5 w-5" />
                  Manage Tokens
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
