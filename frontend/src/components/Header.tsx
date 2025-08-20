import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from './WalletSelector';
import { ThemeToggle } from './ThemeToggle';
import { ProfileSetupModal } from './ProfileSetupModal';
import { useUserProfile } from '../contexts/UserProfileContext';
import { Sparkles, User, Settings } from 'lucide-react';
import { NETWORK } from '../config/constants';

export const Header: React.FC = () => {
  const { connected, account, network } = useWallet();
  const { profile } = useUserProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  return (
    <>
      <ProfileSetupModal 
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        onComplete={() => setShowProfileSetup(false)}
      />
      
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Meme NFT Minter</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create & Trade Meme NFTs on Aptos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Network indicator */}
              {connected && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-medium ${
                  network?.name === NETWORK 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    network?.name === NETWORK ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span>{network?.name?.toUpperCase() || 'UNKNOWN'}</span>
                </div>
              )}
              
              {/* Profile/Account Info */}
              {connected && account && (
                <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {profile?.username || `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                  </span>
                </div>
              )}
              
              <ThemeToggle />
              <WalletSelector />
              
              {/* Profile Setup/Edit Button */}
              {connected && account && (
                <button
                  onClick={() => setShowProfileSetup(true)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors"
                  title={profile ? "Edit Profile" : "Setup Profile"}
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
