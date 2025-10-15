import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rocket, Shield, Zap, Globe } from "lucide-react";

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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Create Tokens Across
            <br />
            <span className="bg-gradient-to-r from-primary to-polygon bg-clip-text text-transparent">
              Multiple Blockchains
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            AIQX Labs - Professional token creation platform supporting Ethereum, BSC, Polygon, Arbitrum, and Base
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="gap-2" data-testid="button-create-token">
                <Rocket className="h-5 w-5" />
                Create Token
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 backdrop-blur-sm bg-background/50" data-testid="button-view-dashboard">
                <Globe className="h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose AIQX Labs?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8">
              <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Deployment</h3>
              <p className="text-muted-foreground">
                Deploy tokens in minutes across multiple blockchains with our optimized smart contracts and streamlined process.
              </p>
            </Card>

            <Card className="p-8">
              <div className="h-12 w-12 rounded-md bg-success/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Audited</h3>
              <p className="text-muted-foreground">
                Our smart contract templates are battle-tested and follow industry best practices for maximum security.
              </p>
            </Card>

            <Card className="p-8">
              <div className="h-12 w-12 rounded-md bg-polygon/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-polygon" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Chain Support</h3>
              <p className="text-muted-foreground">
                Deploy to Ethereum, BSC, Polygon, Arbitrum, and Base all from one unified platform.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Token Types
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Standard ERC20</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Basic token with transfer functionality
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Transfer</span>
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Balance</span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Mintable</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Owner can create new tokens
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Transfer</span>
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Minting</span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Burnable</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Holders can destroy their tokens
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Transfer</span>
                <span className="text-xs px-2 py-1 bg-muted rounded-md">Burning</span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Taxable</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tax on transfers to treasury
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
