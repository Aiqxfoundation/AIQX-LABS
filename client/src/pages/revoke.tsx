import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Search } from "lucide-react";

export default function Revoke() {
  const [tokenAddress, setTokenAddress] = useState("");

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Revoke Authorities
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Easily revoke the Freeze or Mint Authority of any Token you created
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="freeze" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="freeze" data-testid="tab-revoke-freeze">
              Revoke Freeze
            </TabsTrigger>
            <TabsTrigger value="mint" data-testid="tab-revoke-mint">
              Revoke Mint
            </TabsTrigger>
          </TabsList>

          <TabsContent value="freeze">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Revoke Freeze Authority</CardTitle>
                <CardDescription>
                  Easily revoke the Freeze Authority of any Token you created.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="freeze-token-address">Token Address *</Label>
                  <div className="relative">
                    <Input
                      id="freeze-token-address"
                      placeholder="Connect your wallet please"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      className="pr-10"
                      data-testid="input-freeze-token-address"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <Button 
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  size="lg"
                  data-testid="button-revoke-freeze"
                >
                  Revoke Freeze
                </Button>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    The cost of Revoking the Freeze Authority is 0.1 SOL.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    This process is necessary for creating a Liquidity Pool on Solana Blockchain.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mint">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Revoke Mint Authority</CardTitle>
                <CardDescription>
                  Permanently remove the ability to mint new tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mint-token-address">Token Address *</Label>
                  <div className="relative">
                    <Input
                      id="mint-token-address"
                      placeholder="Connect your wallet please"
                      data-testid="input-mint-token-address"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <Button 
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  size="lg"
                  data-testid="button-revoke-mint"
                >
                  Revoke Mint
                </Button>

                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-xs text-amber-800 dark:text-amber-400 font-semibold mb-1">
                    ⚠️ Warning: This action is irreversible
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-500">
                    Once you revoke mint authority, you will never be able to mint new tokens again.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
