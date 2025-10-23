import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Lock, Loader2, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ethers } from 'ethers';

// ERC20 ABI for token transfers
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

interface EvmToolsProps {
  chainId: string;
  chainName: string;
  gradient: string;
}

export default function EvmTools({ chainId, chainName, gradient }: EvmToolsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Multisender state
  const [multisenderOpen, setMultisenderOpen] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [recipientsText, setRecipientsText] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // Token Locker state
  const [lockerOpen, setLockerOpen] = useState(false);
  const [lockTokenAddress, setLockTokenAddress] = useState('');
  const [lockAmount, setLockAmount] = useState('');
  const [lockDuration, setLockDuration] = useState('');
  const [lockDurationType, setLockDurationType] = useState<'days' | 'months'>('days');

  // Multisender - Validate and parse recipients from text or CSV
  const validateAndParseRecipients = (text: string): { 
    valid: { address: string; amount: string }[]; 
    errors: string[];
  } => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    const valid: { address: string; amount: string }[] = [];
    const errors: string[] = [];

    lines.forEach((line, index) => {
      const parts = line.split(',').map(s => s.trim());
      
      if (parts.length !== 2) {
        errors.push(`Line ${index + 1}: Invalid format (expected: address,amount)`);
        return;
      }

      const [address, amount] = parts;

      // Validate address
      if (!ethers.isAddress(address)) {
        errors.push(`Line ${index + 1}: Invalid address "${address}"`);
        return;
      }

      // Validate amount
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        errors.push(`Line ${index + 1}: Invalid amount "${amount}" (must be positive number)`);
        return;
      }

      valid.push({ address, amount });
    });

    return { valid, errors };
  };

  // Multisender - Handle CSV file upload
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setRecipientsText(text);
      };
      reader.readAsText(file);
    }
  };

  // Multisender - Execute batch transfers
  const handleMultisend = async () => {
    if (!tokenAddress || !recipientsText) {
      toast({
        title: 'Missing Information',
        description: 'Please provide token address and recipients list',
        variant: 'destructive',
      });
      return;
    }

    // Validate token address
    if (!ethers.isAddress(tokenAddress)) {
      toast({
        title: 'Invalid Token Address',
        description: 'Please provide a valid token contract address',
        variant: 'destructive',
      });
      return;
    }

    // Validate and parse recipients
    const { valid: recipients, errors } = validateAndParseRecipients(recipientsText);
    
    if (errors.length > 0) {
      toast({
        title: 'Validation Errors',
        description: `Found ${errors.length} error(s):\n${errors.slice(0, 3).join('\n')}${errors.length > 3 ? '\n...' : ''}`,
        variant: 'destructive',
      });
      return;
    }

    if (recipients.length === 0) {
      toast({
        title: 'No Valid Recipients',
        description: 'Please provide at least one valid recipient',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Get provider and signer
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

      // Get token info and check sender balance
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      const senderAddress = await signer.getAddress();
      const balance = await tokenContract.balanceOf(senderAddress);

      // Calculate total amount in base units (BigInt) for precise comparison
      let totalAmountBigInt = BigInt(0);
      for (const recipient of recipients) {
        const amountInBaseUnits = ethers.parseUnits(recipient.amount, decimals);
        totalAmountBigInt += amountInBaseUnits;
      }

      // Check if sender has enough balance (BigInt comparison - no floating point errors)
      if (totalAmountBigInt > balance) {
        const totalFormatted = ethers.formatUnits(totalAmountBigInt, decimals);
        const balanceFormatted = ethers.formatUnits(balance, decimals);
        toast({
          title: 'Insufficient Balance',
          description: `You need ${totalFormatted} ${symbol} but only have ${balanceFormatted} ${symbol}`,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Format values for display only
      const totalFormatted = ethers.formatUnits(totalAmountBigInt, decimals);
      const balanceFormatted = ethers.formatUnits(balance, decimals);

      // Confirm with user
      const confirmed = confirm(
        `Send ${symbol} to ${recipients.length} addresses?\n\n` +
        `Total Amount: ${totalFormatted} ${symbol}\n` +
        `Your Balance: ${balanceFormatted} ${symbol}\n` +
        `Gas will be required for ${recipients.length} transactions.\n\n` +
        `Click OK to proceed.`
      );

      if (!confirmed) {
        setLoading(false);
        return;
      }

      // Execute transfers
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < recipients.length; i++) {
        const { address, amount } = recipients[i];
        try {
          const amountWei = ethers.parseUnits(amount, decimals);
          const tx = await tokenContract.transfer(address, amountWei);
          await tx.wait();
          successCount++;
          toast({
            title: `Transfer ${i + 1}/${recipients.length}`,
            description: `Sent ${amount} ${symbol} to ${address.slice(0, 6)}...${address.slice(-4)}`,
          });
        } catch (error: any) {
          failCount++;
          console.error(`Failed to send to ${address}:`, error);
        }
      }

      toast({
        title: 'Multisend Complete',
        description: `✅ ${successCount} successful, ❌ ${failCount} failed`,
      });
      setMultisenderOpen(false);
      setRecipientsText('');
      setTokenAddress('');
    } catch (error: any) {
      console.error('Multisend error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to execute multisend',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Token Locker - Create time-locked position
  const handleCreateLock = async () => {
    toast({
      title: 'Coming Soon',
      description: 'Token Locker requires deploying a smart contract. This feature will be available soon.',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className={`bg-gradient-to-r ${gradient} p-8 rounded-lg mb-8`}>
        <h1 className="text-4xl font-bold text-white mb-2">{chainName} Advanced Tools</h1>
        <p className="text-white/90 text-lg">
          Multisender and Token Locker tools for {chainName}
        </p>
      </div>

      {/* Network Selector Alert */}
      <Alert className="mb-6 bg-blue-900/50 border-blue-700">
        <AlertCircle className="h-4 w-4 text-blue-400" />
        <AlertTitle className="text-blue-200">Connect Your Wallet</AlertTitle>
        <AlertDescription className="text-blue-300">
          Make sure MetaMask is connected to <strong>{chainName}</strong> network before using these tools.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multisender Tool */}
        <Dialog open={multisenderOpen} onOpenChange={setMultisenderOpen}>
          <DialogTrigger asChild>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-700 hover:border-blue-500" 
              data-testid="card-multisender"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-700/50 rounded-lg">
                    <Send className="h-6 w-6 text-blue-200" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Multisender</CardTitle>
                    <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600 text-white">
                      Available
                    </div>
                  </div>
                </div>
                <CardDescription className="text-blue-200 mt-4">
                  Send tokens to multiple addresses in one batch
                </CardDescription>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Multisender Tool</DialogTitle>
              <DialogDescription className="text-slate-300">
                Send {chainName} tokens to multiple addresses at once
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Token Contract Address</Label>
                <Input
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="0x..."
                  className="bg-slate-800 border-slate-600 text-white"
                  data-testid="input-token-address"
                />
              </div>
              
              <div>
                <Label className="text-white">Recipients (Address, Amount)</Label>
                <Textarea
                  value={recipientsText}
                  onChange={(e) => setRecipientsText(e.target.value)}
                  placeholder={"0x1234...,100\n0x5678...,50\n0x9abc...,25"}
                  rows={8}
                  className="bg-slate-800 border-slate-600 text-white font-mono text-sm"
                  data-testid="input-recipients"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Format: One address and amount per line, separated by comma
                </p>
              </div>

              <div>
                <Label className="text-white flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Or Upload CSV File
                </Label>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="bg-slate-800 border-slate-600 text-white"
                  data-testid="input-csv-file"
                />
              </div>

              {recipientsText && (
                (() => {
                  const { valid, errors } = validateAndParseRecipients(recipientsText);
                  return (
                    <Alert className={errors.length > 0 ? "bg-red-900/50 border-red-700" : "bg-slate-800 border-slate-600"}>
                      <AlertCircle className={errors.length > 0 ? "h-4 w-4 text-red-400" : "h-4 w-4 text-blue-400"} />
                      <AlertDescription className={errors.length > 0 ? "text-red-300" : "text-slate-300"}>
                        {errors.length > 0 ? (
                          <div>
                            <div className="font-semibold mb-1">⚠️ {errors.length} validation error(s):</div>
                            <div className="text-sm space-y-1">
                              {errors.slice(0, 5).map((err, i) => <div key={i}>• {err}</div>)}
                              {errors.length > 5 && <div>• ...and {errors.length - 5} more</div>}
                            </div>
                          </div>
                        ) : (
                          `✅ ${valid.length} valid recipient(s) ready to receive tokens`
                        )}
                      </AlertDescription>
                    </Alert>
                  );
                })()
              )}
            </div>
            <DialogFooter>
              <Button 
                onClick={handleMultisend} 
                disabled={loading} 
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-multisend"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send to All'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Token Locker Tool */}
        <Dialog open={lockerOpen} onOpenChange={setLockerOpen}>
          <DialogTrigger asChild>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-700 hover:border-purple-500 opacity-75" 
              data-testid="card-token-locker"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-700/50 rounded-lg">
                    <Lock className="h-6 w-6 text-purple-200" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Token Locker</CardTitle>
                    <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-600 text-white">
                      Coming Soon
                    </div>
                  </div>
                </div>
                <CardDescription className="text-purple-200 mt-4">
                  Lock tokens for a specific period of time
                </CardDescription>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Token Locker</DialogTitle>
              <DialogDescription className="text-slate-300">
                Time-lock your tokens for vesting or security purposes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Alert className="bg-amber-900/50 border-amber-700">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <AlertTitle className="text-amber-200">Coming Soon</AlertTitle>
                <AlertDescription className="text-amber-300">
                  Token Locker requires deploying a time-lock smart contract. This feature is under development and will be available soon.
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-white">Token Address</Label>
                <Input
                  value={lockTokenAddress}
                  onChange={(e) => setLockTokenAddress(e.target.value)}
                  placeholder="0x..."
                  className="bg-slate-800 border-slate-600 text-white"
                  disabled
                  data-testid="input-lock-token"
                />
              </div>

              <div>
                <Label className="text-white">Amount to Lock</Label>
                <Input
                  type="number"
                  value={lockAmount}
                  onChange={(e) => setLockAmount(e.target.value)}
                  placeholder="1000"
                  className="bg-slate-800 border-slate-600 text-white"
                  disabled
                  data-testid="input-lock-amount"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Lock Duration</Label>
                  <Input
                    type="number"
                    value={lockDuration}
                    onChange={(e) => setLockDuration(e.target.value)}
                    placeholder="30"
                    className="bg-slate-800 border-slate-600 text-white"
                    disabled
                    data-testid="input-lock-duration"
                  />
                </div>
                <div>
                  <Label className="text-white">Duration Type</Label>
                  <Select value={lockDurationType} onValueChange={(v) => setLockDurationType(v as 'days' | 'months')} disabled>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white" data-testid="select-lock-duration-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleCreateLock} 
                disabled 
                className="bg-purple-600 hover:bg-purple-700"
                data-testid="button-create-lock"
              >
                Create Lock
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
