import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { ChevronDownIcon, WalletIcon } from '@heroicons/react/24/outline';

export const WalletSelector: React.FC = () => {
  const { wallets, connect, disconnect, connected, wallet } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  // Filter to only show Petra and Pontem wallets
  const allowedWallets = wallets?.filter(w => 
    w.name.toLowerCase().includes('petra') || 
    w.name.toLowerCase().includes('pontem')
  ) || [];

  const handleConnect = async (walletName: string) => {
    try {
      console.log('Attempting to connect to:', walletName);
      await connect(walletName as any);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      // Provide user-friendly error messages
      if (error.message?.includes('not installed') || error.message?.includes('not found')) {
        alert(`${walletName} wallet is not installed. Please install the ${walletName} browser extension and try again.`);
      } else {
        alert(`Failed to connect to ${walletName}: ${error.message || 'Unknown error'}`);
      }
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
              className="btn-secondary w-full text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Disconnect Wallet
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Choose your wallet:</p>
              {allowedWallets.map((availableWallet) => (
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
                  <div className="flex-1 text-left">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{availableWallet.name}</span>
                    {!availableWallet.readyState && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Click to install</p>
                    )}
                  </div>
                </button>
              ))}
              {allowedWallets.length === 0 && (
                <div className="px-4 py-3 space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No supported wallets found. Please install one of these wallets:
                  </p>
                  <div className="space-y-2">
                    <a
                      href="https://petra.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">Install Petra Wallet</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Most popular Aptos wallet</div>
                    </a>
                    <a
                      href="https://pontem.network/pontem-wallet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">Install Pontem Wallet</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Secure Aptos wallet</div>
                    </a>
                  </div>
                </div>
              )}
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