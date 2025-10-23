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
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Blockchain Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The blockchain you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button data-testid="button-back-home">
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const availableTools = chain.tools.filter(t => t.available);
  const comingSoonTools = chain.tools.filter(t => t.comingSoon);

  return (
    <MainLayout currentChainId={chainId}>
      <div className="space-y-6">

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 glass-light border-gradient hover-lift">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">{availableTools.length}</div>
                <div className="text-xs text-muted-foreground font-medium">Tools Available</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 glass-light border-gradient hover-lift">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">2 min</div>
                <div className="text-xs text-muted-foreground font-medium">Deploy Time</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 glass-light border-gradient hover-lift">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">{comingSoonTools.length}</div>
                <div className="text-xs text-muted-foreground font-medium">Coming Soon</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Available Tools */}
        <div>
          <h3 className="text-base font-semibold mb-4">Available Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTools.map((tool) => {
              const IconComponent = iconMap[tool.icon] || Coins;
              return (
                <Link key={tool.id} href={tool.route}>
                  <Card 
                    className="group p-5 hover-lift glass-light transition-smooth cursor-pointer border border-border/50 hover:border-primary/50"
                    data-testid={`card-tool-${tool.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${chain.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 text-xs font-semibold shadow-sm">
                        Available
                      </Badge>
                    </div>
                    <h4 className="text-base font-bold mb-2 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                      Launch Tool
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Coming Soon Tools */}
        {comingSoonTools.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4">Coming Soon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonTools.map((tool) => {
                const IconComponent = iconMap[tool.icon] || Coins;
                return (
                  <Card 
                    key={tool.id}
                    className="p-5 glass-light border border-border/30 opacity-70 cursor-not-allowed relative overflow-hidden"
                    data-testid={`card-tool-${tool.id}`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${chain.gradient} opacity-50 flex items-center justify-center shadow-md`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="outline" className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-500 border-orange-500/30 text-xs font-semibold">
                          Coming Soon
                        </Badge>
                      </div>
                      <h4 className="text-base font-bold mb-2 text-muted-foreground">
                        {tool.name}
                      </h4>
                      <p className="text-sm text-muted-foreground/70">
                        {tool.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="p-8 glass relative overflow-hidden border-gradient">
          <div className="absolute inset-0 gradient-mesh opacity-50" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Ready to Get Started?
              </h3>
              <p className="text-sm text-muted-foreground">
                Create your first token on {chain.displayName} in just a few clicks
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href={chain.routes.create}>
                <Button size="lg" className="gap-2 shadow-lg hover-lift" data-testid="button-create-token">
                  <Coins className="h-5 w-5" />
                  Create Token
                </Button>
              </Link>
              <Link href={chain.routes.manage}>
                <Button size="lg" variant="outline" className="gap-2 hover-lift border-primary/20" data-testid="button-manage-tokens">
                  <Settings className="h-5 w-5" />
                  Manage Tokens
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
