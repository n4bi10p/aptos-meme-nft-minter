import React from 'react';
import { AptosWalletAdapterProvider, NetworkName } from '@aptos-labs/wallet-adapter-react';

const wallets = [
  // Wallets will be automatically detected and included
];

interface WalletContextProviderProps {
  children: React.ReactNode;
}

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({ children }) => {
  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      dappConfig={{
        network: NetworkName.Testnet,
        aptosConnectDappId: "meme-nft-minter"
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
