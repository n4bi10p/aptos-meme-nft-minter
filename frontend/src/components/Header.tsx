import React from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from './WalletSelector';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { connected, account } = useWallet();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Meme NFT Minter</h1>
              <p className="text-sm text-gray-500">Create & Trade Meme NFTs on Aptos</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {connected && account && (
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">
                  {account.address.slice(0, 6)}...{account.address.slice(-4)}
                </span>
              </div>
            )}
            <WalletSelector />
          </div>
        </div>
      </div>
    </header>
  );
};
