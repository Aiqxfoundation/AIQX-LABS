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
      <div className="space-y-8">
        {/* Chain Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${chain.gradient} flex items-center justify-center shadow-lg`}>
            {(() => {
              const Icon = chain.icon;
              return <Icon className="h-8 w-8 text-white" />;
            })()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{chain.displayName}</h1>
            <p className="text-slate-400">{chain.name === 'bsc' ? 'BSC Mainnet' : chain.displayName === 'Solana' ? 'Mainnet Beta' : 'Mainnet'}</p>
          </div>
        </div>
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Welcome to {chain.displayName} Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            Access all tools for creating and managing tokens on {chain.displayName}. Select a tool below to get started.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{availableTools.length}</div>
                <div className="text-sm text-muted-foreground">Tools Available</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Coins className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">2 min</div>
                <div className="text-sm text-muted-foreground">Deploy Time</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{comingSoonTools.length}</div>
                <div className="text-sm text-muted-foreground">Coming Soon</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Available Tools */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Available Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTools.map((tool) => {
              const IconComponent = iconMap[tool.icon] || Coins;
              return (
                <Link key={tool.id} href={tool.route}>
                  <Card 
                    className="group p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/50"
                    data-testid={`card-tool-${tool.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${chain.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Available
                      </Badge>
                    </div>
                    <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
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
            <h3 className="text-2xl font-bold mb-6">Coming Soon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonTools.map((tool) => {
                const IconComponent = iconMap[tool.icon] || Coins;
                return (
                  <Card 
                    key={tool.id}
                    className="p-6 opacity-60"
                    data-testid={`card-tool-${tool.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <Badge variant="outline" className="border-orange-500/20 text-orange-500">
                        Coming Soon
                      </Badge>
                    </div>
                    <h4 className="text-lg font-bold mb-2">
                      {tool.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Ready to Get Started?
              </h3>
              <p className="text-muted-foreground">
                Create your first token on {chain.displayName} in just a few clicks
              </p>
            </div>
            <div className="flex gap-3">
              <Link href={chain.routes.create}>
                <Button size="lg" className="gap-2" data-testid="button-create-token">
                  <Coins className="h-5 w-5" />
                  Create Token
                </Button>
              </Link>
              <Link href={chain.routes.manage}>
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-manage-tokens">
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
