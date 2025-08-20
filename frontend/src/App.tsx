import React from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletContextProvider } from './contexts/WalletContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { Header } from './components/Header';
import { MintNFT } from './components/MintNFT';
import { NFTGallery } from './components/NFTGallery';

function AppContent() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to Meme NFT Minter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create, mint, and trade unique meme NFTs on the Aptos blockchain. 
            Express your creativity and join the meme economy!
          </p>
        </div>

        <div className={`grid gap-8 mb-12 ${connected ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          <MintNFT />
          {!connected && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">How it works</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Connect Wallet</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Connect your Aptos wallet to get started</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Create NFT</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Design your meme and set a mint price</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Trade & Earn</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">List your NFT and earn from sales</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <NFTGallery />
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; 2025 Meme NFT Minter. Built on Aptos blockchain.
            </p>
            <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
              <span>Made with</span>
              <span className="text-red-500">♥</span>
              <span>for the meme community by</span>
              <a 
                href="https://n4bi10p.github.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors underline decoration-1 underline-offset-2 hover:decoration-2"
              >
                N4bi10p
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WalletContextProvider>
        <UserProfileProvider>
          <AppContent />
        </UserProfileProvider>
      </WalletContextProvider>
    </ThemeProvider>
  );
}

export default App;
