import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';
import { getNetworkConfig, addNetwork, isChainSupported } from '@/config/networks';

interface EvmWalletContextType {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  networkName: string | null;
  isWrongNetwork: boolean;
  targetChainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchChain: (targetChainId: number) => Promise<void>;
  signTransaction: (tx: any) => Promise<string>;
  setTargetChainId: (chainId: number | null) => void;
  isMetaMaskInstalled: boolean;
  addAndSwitchNetwork: (chainId: number) => Promise<void>;
}

const EvmWalletContext = createContext<EvmWalletContextType | undefined>(undefined);

export function EvmWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [targetChainId, setTargetChainId] = useState<number | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  const isWrongNetwork = targetChainId !== null && chainId !== null && targetChainId !== chainId;

  useEffect(() => {
    const checkMetaMask = () => {
      setIsMetaMaskInstalled(typeof window !== 'undefined' && !!window.ethereum);
    };

    checkMetaMask();
    window.addEventListener('ethereum#initialized', checkMetaMask);

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      checkConnection();
    }

    return () => {
      window.removeEventListener('ethereum#initialized', checkMetaMask);
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (chainId !== null) {
      const network = getNetworkConfig(chainId);
      setNetworkName(network?.displayName || 'Unknown Network');
    } else {
      setNetworkName(null);
    }
  }, [chainId]);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAddress(null);
    } else {
      setAddress(accounts[0]);
    }
  };

  const handleChainChanged = (newChainId: string) => {
    setChainId(parseInt(newChainId, 16));
  };

  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(chainIdHex, 16));
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed. Please install MetaMask to continue.');
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(chainIdHex, 16));
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('Connection rejected by user');
      }
      throw error;
    }
  };

  const disconnect = () => {
    setAddress(null);
    setChainId(null);
  };

  const switchChain = async (targetChainId: number) => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added to wallet, try to add it
        await addAndSwitchNetwork(targetChainId);
      } else if (error.code === 4001) {
        throw new Error('User rejected the request');
      } else {
        throw error;
      }
    }
  };

  const addAndSwitchNetwork = async (chainId: number) => {
    if (!isChainSupported(chainId)) {
      throw new Error('This network is not supported');
    }
    
    try {
      await addNetwork(chainId);
      // After adding, try switching again
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected adding the network');
      }
      throw error;
    }
  };

  const signTransaction = async (tx: any) => {
    if (!window.ethereum || !address) {
      throw new Error('Wallet not connected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const txResponse = await signer.sendTransaction(tx);
    await txResponse.wait();
    return txResponse.hash;
  };

  return (
    <EvmWalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        chainId,
        networkName,
        isWrongNetwork,
        targetChainId,
        connect,
        disconnect,
        switchChain,
        signTransaction,
        setTargetChainId,
        isMetaMaskInstalled,
        addAndSwitchNetwork,
      }}
    >
      {children}
    </EvmWalletContext.Provider>
  );
}

export function useEvmWallet() {
  const context = useContext(EvmWalletContext);
  if (!context) {
    throw new Error('useEvmWallet must be used within EvmWalletProvider');
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
