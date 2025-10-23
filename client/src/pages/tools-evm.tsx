import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface EvmToolsProps {
  chainId: string;
  chainName: string;
  gradient?: string;
}

export default function EvmTools({ chainId, chainName }: EvmToolsProps) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
          {chainName} Tools
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Advanced tools for {chainName} tokens
        </p>
      </div>

      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-cyan-500" />
          </div>
          <CardTitle className="text-xl">Coming Soon</CardTitle>
          <CardDescription>
            Advanced tools for {chainName} are currently in development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            We're working on bringing you powerful tools for managing your {chainName} tokens.
            Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
