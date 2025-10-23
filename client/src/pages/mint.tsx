import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Search } from "lucide-react";

export default function Mint() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Mint Tokens
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mint additional tokens to any wallet address
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="mint-new" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="mint-new" data-testid="tab-mint-new">
              Mint New
            </TabsTrigger>
            <TabsTrigger value="batch-mint" data-testid="tab-batch-mint">
              Batch Mint
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mint-new">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Mint New Tokens</CardTitle>
                <CardDescription>
                  Mint additional tokens to a specific address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token-address">Token Address *</Label>
                  <div className="relative">
                    <Input
                      id="token-address"
                      placeholder="Enter token address"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      className="pr-10"
                      data-testid="input-token-address"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">Connect your wallet first</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient-address">Recipient Address *</Label>
                  <Input
                    id="recipient-address"
                    placeholder="Enter recipient wallet address"
                    data-testid="input-recipient-address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mint-amount">Amount *</Label>
                  <Input
                    id="mint-amount"
                    type="number"
                    placeholder="Enter amount to mint"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    data-testid="input-mint-amount"
                  />
                </div>

                <Button 
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  size="lg"
                  data-testid="button-mint-tokens"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  Mint Tokens
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  The cost of minting tokens is approximately 0.1 SOL
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batch-mint">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Batch Mint Tokens</CardTitle>
                <CardDescription>
                  Mint tokens to multiple addresses at once
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="batch-token-address">Token Address *</Label>
                  <Input
                    id="batch-token-address"
                    placeholder="Enter token address"
                    data-testid="input-batch-token-address"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload CSV File</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Drop CSV file here or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Format: address, amount (one per line)
                    </p>
                  </div>
                </div>

                <Button 
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  size="lg"
                  disabled
                  data-testid="button-batch-mint"
                >
                  Batch Mint Tokens
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
