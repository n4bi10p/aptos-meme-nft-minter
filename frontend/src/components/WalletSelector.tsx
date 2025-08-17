import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { ChevronDownIcon, WalletIcon } from '@heroicons/react/24/outline';

export const WalletSelector: React.FC = () => {
  const { wallets, connect, disconnect, connected, wallet } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName as any);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${connected ? 'btn-secondary' : 'btn-primary'} flex items-center space-x-2`}
      >
        <WalletIcon className="w-5 h-5" />
        <span>
          {connected ? wallet?.name || 'Connected' : 'Connect Wallet'}
        </span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 card animate-slide-up">
          {connected ? (
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors text-red-600 dark:text-red-400 font-medium"
            >
              Disconnect Wallet
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Choose your wallet:</p>
              {wallets && wallets.map((availableWallet) => (
                <button
                  key={availableWallet.name}
                  onClick={() => handleConnect(availableWallet.name)}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <img
                    src={availableWallet.icon}
                    alt={availableWallet.name}
                    className="w-8 h-8 rounded-lg"
                  />
                  <span className="font-medium text-gray-900 dark:text-gray-100">{availableWallet.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};