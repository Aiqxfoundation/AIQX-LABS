import { useParams } from "wouter";
import { ChainLayout } from "@/components/ChainLayout";
import { getChainConfig } from "@/config/chains";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Import existing manage pages
import ManageSolana from "@/pages/manage-solana";

export default function ChainManage() {
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

  // Render the appropriate manage page based on chain ID
  let ManageComponent;
  switch (chainId) {
    case 'solana':
      ManageComponent = ManageSolana;
      break;
    default:
      return (
        <ChainLayout chain={chain} activeTab="manage">
          <div className="text-center py-12">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-muted-foreground mb-6">
                Token management for {chain.displayName} is coming soon! In the meantime, you can view all your deployed tokens on the Dashboard.
              </p>
              <Link href="/dashboard">
                <Button data-testid="button-go-dashboard">
                  Go to Dashboard
                </Button>
              </Link>
            </Card>
          </div>
        </ChainLayout>
      );
  }

  return (
    <ChainLayout chain={chain} activeTab="manage">
      <ManageComponent />
    </ChainLayout>
  );
}
