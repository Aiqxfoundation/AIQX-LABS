import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CHAIN_DEFINITIONS } from "@/config/chains";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const chains = Object.values(CHAIN_DEFINITIONS);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-cyan-900/20 text-[#00d4ff] rounded-full text-sm font-medium mb-6">
            Multi-Chain Token Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tokens & Tools with Ease
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Launch tokens, manage liquidity, and use advanced tools across multiple blockchains. Effortless and without coding.
          </p>
        </div>

        {/* Blockchain Selection */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Select Your Blockchain
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chains.map((chain) => {
              const Icon = chain.icon;
              return (
                <Link key={chain.id} href={`/chain/${chain.id}`}>
                  <Card className="bg-gray-900 border-gray-800 hover:border-[#00d4ff] transition-all cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-cyan-900/20 flex items-center justify-center group-hover:bg-cyan-900/30 transition-colors">
                          <Icon className="h-5 w-5 text-[#00d4ff]" />
                        </div>
                        <div>
                          <CardTitle className="text-base text-white">
                            {chain.displayName}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {chain.network}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-[#00d4ff] hover:bg-cyan-900/20"
                        data-testid={`button-select-${chain.id}`}
                      >
                        Get Started <ArrowRight className="h-3.5 w-3.5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            What You Can Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-base">Create Tokens</CardTitle>
                <CardDescription className="text-sm">
                  Deploy custom tokens across multiple blockchains without coding
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-base">Manage Authority</CardTitle>
                <CardDescription className="text-sm">
                  Revoke or transfer mint and freeze authorities with ease
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-base">Advanced Tools</CardTitle>
                <CardDescription className="text-sm">
                  Access multisender, token burning, and metadata updates
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/tools">
            <Button 
              size="lg" 
              className="bg-[#00d4ff] hover:bg-[#00b8e6] text-white px-8"
              data-testid="button-explore-tools"
            >
              Explore All Tools
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
