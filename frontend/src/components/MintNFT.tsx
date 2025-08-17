import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { MINT_FUNCTION, NETWORK } from '../config/constants';

export const MintNFT: React.FC = () => {
  const { connected, account, signAndSubmitTransaction, network } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !account) {
      alert('Please connect your wallet first!');
      return;
    }

    // Network validation
    if (network?.name !== NETWORK) {
      alert(`Please switch your wallet to ${NETWORK.toUpperCase()} network. Currently connected to: ${network?.name || 'unknown'}`);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        function: MINT_FUNCTION,
        functionArguments: [
          formData.name,
          (parseInt(formData.price) * 100000000).toString(), // Convert to octas
        ],
      };

      console.log('Submitting transaction with payload:', payload);
      console.log('Current network:', network);
      
      const response = await signAndSubmitTransaction({ data: payload } as any);
      console.log('Transaction submitted:', response);
      
      // Reset form
      setFormData({ name: '', price: '' });
      alert('Meme NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert(`Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Mint Meme NFT</h2>
          <p className="text-gray-500 dark:text-gray-400">Create your unique meme NFT</p>
        </div>
      </div>

      {!connected ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to start minting NFTs</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              NFT Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your meme NFT name"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mint Price (APT)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.1"
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.name || !formData.price}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Minting...</span>
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>Mint NFT</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
