import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { evmTokenCreationSchema, type EvmTokenCreationForm, type ChainId, EVM_TOKEN_FEATURES } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChainSelector } from "./chain-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Rocket, 
  Plus, 
  Flame, 
  Pause, 
  Shield, 
  Percent,
  Info,
  Check 
} from "lucide-react";

interface EvmTokenCreationFormProps {
  onSubmit: (data: EvmTokenCreationForm) => void;
  isLoading?: boolean;
  defaultChainId?: ChainId;
  allowedChainIds?: ChainId[];
}

const featureIcons = {
  mintable: Plus,
  burnable: Flame,
  pausable: Pause,
  capped: Shield,
  taxable: Percent,
};

export function EvmTokenCreationForm({ 
  onSubmit, 
  isLoading,
  defaultChainId = "ethereum-mainnet",
  allowedChainIds 
}: EvmTokenCreationFormProps) {
  const form = useForm<EvmTokenCreationForm>({
    resolver: zodResolver(evmTokenCreationSchema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: 18,
      totalSupply: "",
      chainId: defaultChainId,
      isMintable: false,
      isBurnable: false,
      isPausable: false,
      isCapped: false,
      hasTax: false,
      maxSupply: "",
      taxPercentage: 5,
      treasuryWallet: "",
    },
  });

  const selectedFeatures = {
    isMintable: form.watch("isMintable"),
    isBurnable: form.watch("isBurnable"),
    isPausable: form.watch("isPausable"),
    isCapped: form.watch("isCapped"),
    hasTax: form.watch("hasTax"),
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Token Identity Card */}
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Rocket className="h-5 w-5 text-cyan-500" />
              Token Identity
            </CardTitle>
            <CardDescription className="text-gray-400">
              Basic information about your token
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Token Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Awesome Token"
                        {...field}
                        data-testid="input-token-name"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Token Symbol</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MAT"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        data-testid="input-token-symbol"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Initial Supply</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1000000"
                        {...field}
                        data-testid="input-total-supply"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Number of tokens minted at creation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decimals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Decimals</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        data-testid="input-decimals"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Usually 18 (like ETH, USDC)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Token Features Card */}
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white">Token Features</CardTitle>
            <CardDescription className="text-gray-400">
              Select which features you want to enable for your token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-cyan-500/20 bg-cyan-500/5">
              <Info className="h-4 w-4 text-cyan-500" />
              <AlertDescription className="text-sm text-gray-300">
                Select multiple features to combine them in your token. All features are optional.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mintable Feature */}
              <FormField
                control={form.control}
                name="isMintable"
                render={({ field }) => (
                  <Card className={`cursor-pointer transition-all ${
                    field.value 
                      ? "border-cyan-500 bg-cyan-500/10" 
                      : "border-gray-700 hover:border-gray-600"
                  }`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-mintable"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Plus className="h-4 w-4 text-cyan-500" />
                            <label className="text-sm font-medium text-white cursor-pointer">
                              {EVM_TOKEN_FEATURES.mintable.name}
                            </label>
                          </div>
                          <p className="text-xs text-gray-400">
                            {EVM_TOKEN_FEATURES.mintable.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              />

              {/* Burnable Feature */}
              <FormField
                control={form.control}
                name="isBurnable"
                render={({ field }) => (
                  <Card className={`cursor-pointer transition-all ${
                    field.value 
                      ? "border-orange-500 bg-orange-500/10" 
                      : "border-gray-700 hover:border-gray-600"
                  }`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-burnable"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <label className="text-sm font-medium text-white cursor-pointer">
                              {EVM_TOKEN_FEATURES.burnable.name}
                            </label>
                          </div>
                          <p className="text-xs text-gray-400">
                            {EVM_TOKEN_FEATURES.burnable.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              />

              {/* Pausable Feature */}
              <FormField
                control={form.control}
                name="isPausable"
                render={({ field }) => (
                  <Card className={`cursor-pointer transition-all ${
                    field.value 
                      ? "border-purple-500 bg-purple-500/10" 
                      : "border-gray-700 hover:border-gray-600"
                  }`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-pausable"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Pause className="h-4 w-4 text-purple-500" />
                            <label className="text-sm font-medium text-white cursor-pointer">
                              {EVM_TOKEN_FEATURES.pausable.name}
                            </label>
                          </div>
                          <p className="text-xs text-gray-400">
                            {EVM_TOKEN_FEATURES.pausable.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              />

              {/* Capped Feature */}
              <FormField
                control={form.control}
                name="isCapped"
                render={({ field }) => (
                  <Card className={`cursor-pointer transition-all ${
                    field.value 
                      ? "border-blue-500 bg-blue-500/10" 
                      : "border-gray-700 hover:border-gray-600"
                  }`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-capped"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="h-4 w-4 text-blue-500" />
                            <label className="text-sm font-medium text-white cursor-pointer">
                              {EVM_TOKEN_FEATURES.capped.name}
                            </label>
                          </div>
                          <p className="text-xs text-gray-400">
                            {EVM_TOKEN_FEATURES.capped.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              />

              {/* Tax Feature */}
              <FormField
                control={form.control}
                name="hasTax"
                render={({ field }) => (
                  <Card className={`cursor-pointer transition-all ${
                    field.value 
                      ? "border-green-500 bg-green-500/10" 
                      : "border-gray-700 hover:border-gray-600"
                  }`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-taxable"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Percent className="h-4 w-4 text-green-500" />
                            <label className="text-sm font-medium text-white cursor-pointer">
                              {EVM_TOKEN_FEATURES.taxable.name}
                            </label>
                          </div>
                          <p className="text-xs text-gray-400">
                            {EVM_TOKEN_FEATURES.taxable.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Capped Supply Configuration */}
        {selectedFeatures.isCapped && (
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Capped Supply Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="maxSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Maximum Supply</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10000000"
                        {...field}
                        data-testid="input-max-supply"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500">
                      Maximum number of tokens that can ever exist (including initial supply)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Tax Configuration */}
        {selectedFeatures.hasTax && (
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Percent className="h-5 w-5 text-green-500" />
                Transfer Tax Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="taxPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Tax Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={25}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-tax-percentage"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Percentage of each transfer sent to treasury (0-25%)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="treasuryWallet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Treasury Wallet</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0x..."
                          {...field}
                          data-testid="input-treasury-wallet"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500">
                        Address to receive tax fees
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blockchain Network */}
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white">Blockchain Network</CardTitle>
            <CardDescription className="text-gray-400">
              Select the network to deploy your token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="chainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Select Network</FormLabel>
                  <FormControl>
                    <ChainSelector
                      value={field.value}
                      onChange={field.onChange}
                      allowedChainIds={allowedChainIds}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Selected Features Summary */}
        {Object.values(selectedFeatures).some(v => v) && (
          <Alert className="border-cyan-500/20 bg-cyan-500/5">
            <Check className="h-4 w-4 text-cyan-500" />
            <AlertDescription className="text-sm text-gray-300">
              <strong className="text-white">Selected Features:</strong>{" "}
              {Object.entries(selectedFeatures)
                .filter(([_, enabled]) => enabled)
                .map(([feature]) => {
                  const featureName = feature.replace(/^is|^has/, '');
                  return featureName.charAt(0).toUpperCase() + featureName.slice(1);
                })
                .join(", ")}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          size="lg"
          data-testid="button-create-token"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating Token...
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-5 w-5" />
              Create Token
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
