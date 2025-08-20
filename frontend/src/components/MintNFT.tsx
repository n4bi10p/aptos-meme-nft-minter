import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { MINT_FUNCTION, NETWORK } from '../config/constants';
import { ImageUpload } from './ImageUpload';
import { CategoriesAndTags } from './CategoriesAndTags';
import { useUserProfile } from '../contexts/UserProfileContext';
import { CategoriesService } from '../services/categories';

export const MintNFT: React.FC = () => {
  const { connected, account, signAndSubmitTransaction, network } = useWallet();
  const { profile } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUri: '',
    category: '',
    tags: [] as string[],
    imageHash: '',
    compressed: false
  });

  const handleImageUpload = (imageUri: string, file: File, metadata: { hash: string; compressed: boolean }) => {
    setFormData(prev => ({ 
      ...prev, 
      imageUri,
      imageHash: metadata.hash,
      compressed: metadata.compressed
    }));
    setError(null);
  };

  const handleImageError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !account) {
      setError('Please connect your wallet first!');
      return;
    }

    if (!formData.name || !formData.description || !formData.price || !formData.imageUri) {
      setError('Please fill in all fields and upload an image');
      return;
    }

    // Network validation
    if (network?.name !== NETWORK) {
      setError(`Please switch your wallet to ${NETWORK.toUpperCase()} network. Currently connected to: ${network?.name || 'unknown'}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs before creating payload
      const name = formData.name.trim();
      const description = formData.description.trim();
      const imageUri = formData.imageUri.trim();
      const priceInOctas = Math.floor(parseFloat(formData.price) * 100000000);
      
      console.log('Price calculation debug:', {
        inputPrice: formData.price,
        parsedPrice: parseFloat(formData.price),
        priceInOctas: priceInOctas
      });
      
      if (!name || !description || !imageUri) {
        setError('All fields must be filled with valid data');
        setIsLoading(false);
        return;
      }
      
      if (isNaN(priceInOctas) || priceInOctas < 0) {
        setError('Price must be a valid positive number');
        setIsLoading(false);
        return;
      }
      
      const payload = {
        function: MINT_FUNCTION,
        functionArguments: [
          name, // name: String
          description, // description: String  
          imageUri, // image_uri: String
          priceInOctas.toString(), // mint_price: u64 (in octas)
        ],
      };

      console.log('Submitting transaction with payload:', payload);
      console.log('Current network:', network);
      
      const response = await signAndSubmitTransaction({ data: payload } as any);
      console.log('Transaction submitted:', response);
      
      // Store category and tags for the NFT
      if (formData.category) {
        CategoriesService.addCategoryToNFT(response.hash, formData.category);
      }
      if (formData.tags.length > 0) {
        CategoriesService.addTagsToNFT(response.hash, formData.tags);
      }
      
      // Reset form
      setFormData({ 
        name: '', 
        description: '', 
        price: '', 
        imageUri: '', 
        category: '', 
        tags: [], 
        imageHash: '', 
        compressed: false 
      });
      alert('Meme NFT minted successfully! Check the gallery to see your new NFT.');
      
      // Optional: Trigger a gallery refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('nftMinted'));
    } catch (error: any) {
      console.error('Error minting NFT:', error);
      setError(`Failed to mint NFT: ${error?.message || 'Unknown error'}`);
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
          {profile && (
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Welcome back, {profile.username}!
            </p>
          )}
        </div>
      </div>

        {!connected ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to start minting NFTs</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <ImageUpload 
              onImageUpload={handleImageUpload}
              onError={handleImageError}
            />

            {/* Categories and Tags */}
            <CategoriesAndTags
              selectedCategory={formData.category}
              selectedTags={formData.tags}
              onCategoryChange={(category) => setFormData({ ...formData, category })}
              onTagsChange={(tags) => setFormData({ ...formData, tags })}
            />

            {/* NFT Name */}
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

            {/* Description/Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Caption/Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add a funny caption for your meme..."
                className="input-field resize-none"
                rows={3}
                required
              />
            </div>

            {/* Mint Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mint Price (APT)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.1"
                className="input-field"
                required
              />
            </div>

            {/* Compression Info */}
            {formData.compressed && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-green-700 dark:text-green-300 text-sm">
                  ✅ Image optimized for better performance and lower gas costs
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.imageUri}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
