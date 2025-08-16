import React from 'react';
import { WalletContextProvider } from './contexts/WalletContext';
import { Header } from './components/Header';
import { MintNFT } from './components/MintNFT';
import { NFTGallery } from './components/NFTGallery';

function App() {
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Meme NFT Minter
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create, mint, and trade unique meme NFTs on the Aptos blockchain. 
              Express your creativity and join the meme economy!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <MintNFT />
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How it works</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Connect Wallet</h3>
                    <p className="text-gray-600 text-sm">Connect your Aptos wallet to get started</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Create NFT</h3>
                    <p className="text-gray-600 text-sm">Design your meme and set a mint price</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Trade & Earn</h3>
                    <p className="text-gray-600 text-sm">List your NFT and earn from sales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <NFTGallery />
        </main>

        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center text-gray-500">
              <p>&copy; 2025 Meme NFT Minter. Built on Aptos blockchain.</p>
            </div>
          </div>
        </footer>
      </div>
    </WalletContextProvider>
  );
}

export default App;
