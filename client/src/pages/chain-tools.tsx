import { useParams } from "wouter";
import { ChainLayout } from "@/components/ChainLayout";
import { getChainConfig } from "@/config/chains";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Clock } from "lucide-react";

// Import existing tools pages
import ToolsSolana from "@/pages/tools-solana";

export default function ChainTools() {
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

  // Render the appropriate tools page based on chain ID
  let ToolsComponent;
  switch (chainId) {
    case 'solana':
      ToolsComponent = ToolsSolana;
      break;
    default:
      return (
        <ChainLayout chain={chain} activeTab="tools">
          <div className="text-center py-12">
            <Card className="p-12 max-w-2xl mx-auto">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Advanced Tools Coming Soon</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We're working hard to bring advanced token management tools to {chain.displayName}. Features like multisender, token locker, and more will be available soon!
              </p>
              <div className="flex gap-3 justify-center">
                <Link href={chain.routes.create}>
                  <Button size="lg" data-testid="button-create-token">
                    Create Token Instead
                  </Button>
                </Link>
                <Link href={chain.routes.overview}>
                  <Button size="lg" variant="outline" data-testid="button-back-overview">
                    Back to Overview
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </ChainLayout>
      );
  }

  return (
    <ChainLayout chain={chain} activeTab="tools">
      <ToolsComponent />
    </ChainLayout>
  );
}
