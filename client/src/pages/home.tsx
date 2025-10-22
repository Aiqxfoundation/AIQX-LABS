import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rocket, Shield, Zap, Globe, ChevronRight } from "lucide-react";
import ethereumLogo from "@assets/stock_images/ethereum_cryptocurre_ceeafd86.jpg";
import bscLogo from "@assets/stock_images/binance_smart_chain__ecbf46fc.jpg";
import polygonLogo from "@assets/stock_images/polygon_matic_crypto_623157ed.jpg";
import arbitrumLogo from "@assets/stock_images/arbitrum_cryptocurre_ee7f5bd0.jpg";
import baseLogo from "@assets/stock_images/base_coinbase_crypto_60859dc8.jpg";
import solanaLogo from "@assets/stock_images/solana_sol_cryptocur_bc252dfc.jpg";

const blockchains = [
  { name: "Ethereum", logo: ethereumLogo, path: "/ethereum", color: "from-blue-500 to-blue-600" },
  { name: "BSC", logo: bscLogo, path: "/bsc", color: "from-yellow-500 to-yellow-600" },
  { name: "Polygon", logo: polygonLogo, path: "/polygon", color: "from-purple-500 to-purple-600" },
  { name: "Arbitrum", logo: arbitrumLogo, path: "/arbitrum", color: "from-cyan-500 to-cyan-600" },
  { name: "Base", logo: baseLogo, path: "/base", color: "from-blue-600 to-blue-700" },
  { name: "Solana", logo: solanaLogo, path: "/solana", color: "from-purple-600 to-pink-500" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-polygon/20 opacity-50" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              Most Customizable Token Generator
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Customizable Token
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              For Your Project
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Choose the features you need and take full control of your tokens. Save time and gas fees with our optimized generator. Create ERC-20 or SPL (Solana) tokens today!
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link href="/ethereum">
              <Button size="lg" className="gap-2" data-testid="button-create-token">
                <Rocket className="h-5 w-5" />
                Create a Token
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-view-dashboard">
                <Globe className="h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground mb-4">Powered by</div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {blockchains.map((blockchain) => (
              <Link key={blockchain.name} href={blockchain.path}>
                <Card className="group p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2 hover:border-primary/50" data-testid={`card-blockchain-${blockchain.name.toLowerCase()}`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${blockchain.color} p-0.5 group-hover:scale-110 transition-transform`}>
                      <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                        <img 
                          src={blockchain.logo} 
                          alt={`${blockchain.name} logo`}
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {blockchain.name}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Benefits of Customizable Tokens
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Creating fully customizable ERC-20 and SPL tokens allows you to keep full control over all functions included. Launch your crypto project securely choosing from a huge variety of blockchains available.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">No Technical Skills Required</h3>
              <p className="text-muted-foreground">
                For visionaries taking their first step into crypto who want to launch innovative tokens with professional tools and expert guidance.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Maximize Efficiency</h3>
              <p className="text-muted-foreground">
                For freelancers & crypto enthusiasts who prefer to save time and customize the token according to their specific needs.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate with Confidence</h3>
              <p className="text-muted-foreground">
                For ambitious project owners who want to create secure tokens in order to skyrocket their crypto journey.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Token Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <h3 className="text-lg font-semibold">Standard</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Basic token with transfer functionality
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Transfer</span>
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Balance</span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <h3 className="text-lg font-semibold">Mintable</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Owner can create new tokens after deployment
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Transfer</span>
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Minting</span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <h3 className="text-lg font-semibold">Burnable</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Holders can destroy their tokens to reduce supply
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Transfer</span>
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Burning</span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <h3 className="text-lg font-semibold">Taxable</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Automatic tax on transfers to treasury wallet
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Transfer</span>
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Tax</span>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
