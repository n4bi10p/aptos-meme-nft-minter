import React from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

interface WalletContextProviderProps {
  children: React.ReactNode;
}

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({ children }) => {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: "devnet" as any,
        aptosConnectDappId: "meme-nft-minter"
      }}
      onError={(error) => {
        console.error('Wallet connection error:', error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
