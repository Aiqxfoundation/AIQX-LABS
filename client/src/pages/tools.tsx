import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  UserPlus, 
  Shield, 
  Coins, 
  Flame, 
  Snowflake, 
  FileEdit, 
  DollarSign,
  Download
} from "lucide-react";
import { Link } from "wouter";

const tools = [
  {
    id: "multisender",
    name: "Multisender",
    description: "Send tokens to multiple addresses in one transaction",
    icon: Send,
    href: "/chain/solana/tools",
    available: true,
  },
  {
    id: "transfer-authority",
    name: "Transfer Authority",
    description: "Transfer mint or freeze authority to another wallet",
    icon: UserPlus,
    href: "/chain/solana/tools",
    available: true,
  },
  {
    id: "revoke-authority",
    name: "Revoke Authority",
    description: "Permanently revoke mint or freeze authorities",
    icon: Shield,
    href: "/revoke",
    available: true,
  },
  {
    id: "mint-tokens",
    name: "Mint Tokens",
    description: "Mint additional tokens to any address",
    icon: Coins,
    href: "/mint",
    available: true,
  },
  {
    id: "burn-tokens",
    name: "Burn Tokens",
    description: "Permanently burn tokens from circulation",
    icon: Flame,
    href: "/chain/solana/tools",
    available: true,
  },
  {
    id: "freeze-unfreeze",
    name: "Freeze / Unfreeze",
    description: "Freeze or unfreeze token accounts",
    icon: Snowflake,
    href: "/chain/solana/tools",
    available: true,
  },
  {
    id: "update-metadata",
    name: "Update Metadata",
    description: "Update token name, symbol, or metadata",
    icon: FileEdit,
    href: "/chain/solana/tools",
    available: true,
  },
  {
    id: "change-tax",
    name: "Change Tax Settings",
    description: "Modify transfer tax settings (Token-2022)",
    icon: DollarSign,
    href: "#",
    available: false,
  },
  {
    id: "withdraw-fees",
    name: "Withdraw Fees",
    description: "Withdraw collected fees (Token-2022)",
    icon: Download,
    href: "#",
    available: false,
  },
];

export default function Tools() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Token Tools
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Advanced tools for managing your tokens
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            
            if (!tool.available) {
              return (
                <Card key={tool.id} className="border-gray-200 dark:border-gray-800 opacity-60">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <Icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium">
                        Soon
                      </span>
                    </div>
                    <CardTitle className="text-base text-gray-900 dark:text-white">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            }

            return (
              <Link key={tool.id} href={tool.href}>
                <Card className="border-gray-200 dark:border-gray-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="h-10 w-10 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center mb-3 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/30 transition-colors">
                      <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <CardTitle className="text-base text-gray-900 dark:text-white">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                      data-testid={`button-tool-${tool.id}`}
                    >
                      Launch Tool →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
