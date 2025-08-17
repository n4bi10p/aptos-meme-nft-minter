import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';

interface NFT {
  id: number;
  name: string;
  creator: string;
  mint_price: number;
  owner: string;
}

export const NFTGallery: React.FC = () => {
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);

  const fetchNFTs = useCallback(async () => {
    if (!connected || !account) return;

    setIsLoading(true);
    try {
      // In a real app, you'd query the blockchain for all NFTs
      // For demo purposes, we'll create some mock data
      const mockNFTs: NFT[] = [
        {
          id: 1,
          name: "Doge to the Moon",
          creator: "0x123...abc",
          mint_price: 0.1,
          owner: "0x123...abc"
        },
        {
          id: 2,
          name: "Pepe Vibes",
          creator: "0x456...def",
          mint_price: 0.05,
          owner: "0x456...def"
        },
        {
          id: 3,
          name: "Chad NFT",
          creator: "0x789...ghi",
          mint_price: 0.2,
          owner: "0x789...ghi"
        }
      ];
      setNfts(mockNFTs);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [connected, account]);

  const purchaseNFT = async (nft: NFT) => {
    if (!connected || !account) return;

    setPurchaseLoading(nft.id);
    try {
      const payload = {
        function: "0x64f6979360f13452cd87d367490075326f8e73d21a8bc746695f8d15e12e2016::MemeNFTMinter::purchase_meme_nft",
        functionArguments: [
          nft.owner,
          nft.id.toString(),
        ],
      };

      const response = await signAndSubmitTransaction({ data: payload } as any);
      console.log('Purchase transaction submitted:', response);
      alert('NFT purchased successfully!');
      fetchNFTs(); // Refresh the gallery
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      alert('Failed to purchase NFT. Please try again.');
    } finally {
      setPurchaseLoading(null);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">NFT Gallery</h2>
          <p className="text-gray-500 dark:text-gray-400">Discover and purchase meme NFTs</p>
        </div>
        <button
          onClick={fetchNFTs}
          className="btn-secondary"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {!connected ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Connect your wallet to view NFTs</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{nft.name.charAt(0)}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{nft.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Creator: {nft.creator.slice(0, 6)}...{nft.creator.slice(-4)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary-600">
                  {nft.mint_price} APT
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  {nft.owner !== account?.address && (
                    <button
                      onClick={() => purchaseNFT(nft)}
                      disabled={purchaseLoading === nft.id}
                      className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors disabled:opacity-50"
                    >
                      {purchaseLoading === nft.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 dark:border-primary-400"></div>
                      ) : (
                        <ShoppingCartIcon className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
