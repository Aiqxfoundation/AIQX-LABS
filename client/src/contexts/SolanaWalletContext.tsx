import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SolanaWalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  signAndSendTransaction: (transaction: any) => Promise<string>;
}

const SolanaWalletContext = createContext<SolanaWalletContextType | undefined>(undefined);

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.solana) {
      window.solana.on('connect', () => {
        if (window.solana.publicKey) {
          setPublicKey(window.solana.publicKey.toString());
        }
      });

      window.solana.on('disconnect', () => {
        setPublicKey(null);
      });

      if (window.solana.isConnected && window.solana.publicKey) {
        setPublicKey(window.solana.publicKey.toString());
      }
    }

    return () => {
      if (window.solana) {
        window.solana.removeAllListeners();
      }
    };
  }, []);

  const connect = async () => {
    if (!window.solana) {
      throw new Error('Phantom wallet not installed. Please install Phantom to continue.');
    }

    try {
      const response = await window.solana.connect();
      setPublicKey(response.publicKey.toString());
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('Connection rejected by user');
      }
      throw error;
    }
  };

  const disconnect = async () => {
    if (window.solana) {
      await window.solana.disconnect();
      setPublicKey(null);
    }
  };

  const signAndSendTransaction = async (transaction: any) => {
    if (!window.solana || !publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const { signature } = await window.solana.signAndSendTransaction(transaction);
      return signature;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return (
    <SolanaWalletContext.Provider
      value={{
        publicKey,
        isConnected: !!publicKey,
        connect,
        disconnect,
        signAndSendTransaction,
      }}
    >
      {children}
    </SolanaWalletContext.Provider>
  );
}

export function useSolanaWallet() {
  const context = useContext(SolanaWalletContext);
  if (!context) {
    throw new Error('useSolanaWallet must be used within SolanaWalletProvider');
  }
  return context;
}

declare global {
  interface Window {
    solana?: any;
  }
}
