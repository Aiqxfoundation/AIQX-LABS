import { useParams } from "wouter";
import { ChainLayout } from "@/components/ChainLayout";
import { getChainConfig } from "@/config/chains";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Import existing create pages
import Ethereum from "@/pages/ethereum";
import BSC from "@/pages/bsc";
import Polygon from "@/pages/polygon";
import Arbitrum from "@/pages/arbitrum";
import Base from "@/pages/base";
import Solana from "@/pages/create-solana";

export default function ChainCreate() {
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

  // Render the appropriate create page based on chain ID
  let CreateComponent;
  switch (chainId) {
    case 'ethereum':
      CreateComponent = Ethereum;
      break;
    case 'bsc':
      CreateComponent = BSC;
      break;
    case 'polygon':
      CreateComponent = Polygon;
      break;
    case 'arbitrum':
      CreateComponent = Arbitrum;
      break;
    case 'base':
      CreateComponent = Base;
      break;
    case 'solana':
      CreateComponent = Solana;
      break;
    default:
      return (
        <ChainLayout chain={chain} activeTab="create">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground">
              Token creation for {chain.displayName} is coming soon!
            </p>
          </div>
        </ChainLayout>
      );
  }

  return (
    <ChainLayout chain={chain} activeTab="create">
      <CreateComponent />
    </ChainLayout>
  );
}
