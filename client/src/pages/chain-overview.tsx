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
        <Card className="p-10 text-center max-w-md bg-gray-900 border-gray-800">
          <h2 className="text-3xl font-bold mb-3 text-white">Blockchain Not Found</h2>
          <p className="text-gray-400 mb-6 text-lg">
            The blockchain you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-[#00d4ff] hover:bg-[#00b8e6] text-white" data-testid="button-back-home">
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

        {/* Premium Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg bg-green-600 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-4xl font-bold text-white">{availableTools.length}</div>
                <div className="text-sm text-gray-400 font-semibold uppercase tracking-wide">Tools Available</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg bg-[#00d4ff] flex items-center justify-center">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-4xl font-bold text-white">2 min</div>
                <div className="text-sm text-gray-400 font-semibold uppercase tracking-wide">Deploy Time</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg bg-purple-600 flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-4xl font-bold text-white">{comingSoonTools.length}</div>
                <div className="text-sm text-gray-400 font-semibold uppercase tracking-wide">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Tools Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold text-white">Available Tools</h3>
            <div className="h-px flex-1 bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTools.map((tool, index) => {
              const IconComponent = iconMap[tool.icon] || Coins;
              return (
                <Link key={tool.id} href={tool.route}>
                  <div 
                    className="bg-gray-900 border border-gray-800 group p-6 transition-all cursor-pointer rounded-lg hover:border-[#00d4ff]"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    data-testid={`card-tool-${tool.id}`}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="h-16 w-16 rounded-lg bg-[#00d4ff] flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="bg-[#00d4ff] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        Available
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-white group-hover:text-[#00d4ff] transition-all">
                      {tool.name}
                    </h4>
                    <p className="text-sm text-gray-400 mb-5 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 text-[#00d4ff] text-sm font-bold">
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
              <h3 className="text-2xl font-bold text-white">Coming Soon</h3>
              <div className="h-px flex-1 bg-gray-800" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonTools.map((tool, index) => {
                const IconComponent = iconMap[tool.icon] || Coins;
                return (
                  <div 
                    key={tool.id}
                    className="bg-gray-900 p-6 border border-gray-800 opacity-50 cursor-not-allowed relative overflow-hidden rounded-lg"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    data-testid={`card-tool-${tool.id}`}
                  >
                    <div className="relative">
                      <div className="flex items-start justify-between mb-5">
                        <div className="h-16 w-16 rounded-lg bg-gray-700 opacity-40 flex items-center justify-center">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="bg-gray-800 text-gray-400 border border-gray-700 text-xs font-bold px-3 py-1.5 rounded-full">
                          Coming Soon
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-3 text-gray-500">
                        {tool.name}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
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
        <div className="bg-gray-900 border border-gray-800 p-10 relative overflow-hidden rounded-lg transition-all">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-3 text-white">
                Ready to Get Started?
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                Create your first token on {chain.displayName} in just a few clicks
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <Link href={chain.routes.create}>
                <Button size="lg" className="gap-2 px-8 py-6 text-base bg-[#00d4ff] hover:bg-[#00b8e6] text-white rounded-lg" data-testid="button-create-token">
                  <Coins className="h-5 w-5" />
                  Create Token
                </Button>
              </Link>
              <Link href={chain.routes.manage}>
                <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-base border-gray-800 hover:bg-gray-800 rounded-lg" data-testid="button-manage-tokens">
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
