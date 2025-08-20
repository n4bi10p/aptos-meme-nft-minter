import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { ShoppingCartIcon, EyeIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { NFTService, BlockchainNFT } from '../services/nft';
import { IPFSService } from '../services/ipfs';
import { useUserProfile } from '../contexts/UserProfileContext';
import { PURCHASE_FUNCTION, DELETE_FUNCTION } from '../config/constants';
import { formatPrice, formatAddress } from '../utils/nft';

export const NFTGallery: React.FC = () => {
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const { getDisplayName } = useUserProfile();
  const [nfts, setNfts] = useState<BlockchainNFT[]>([]);
  const [userNFTs, setUserNFTs] = useState<BlockchainNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});

  const fetchNFTs = useCallback(async () => {
    if (!connected || !account) return;

    setIsLoading(true);
    try {
      // Fetch user's own NFTs
      const myNFTs = await NFTService.fetchUserNFTs(account.address);
      setUserNFTs(myNFTs);

      // For the "all" tab, include user's NFTs plus any others we can find
      // In a production app, you'd use an indexer to get all NFTs
      const allAddresses = [account.address];
      
      // Add the contract address to see if there are any NFTs there
      if (account.address !== "0x64f6979360f13452cd87d367490075326f8e73d21a8bc746695f8d15e12e2016") {
        allAddresses.push("0x64f6979360f13452cd87d367490075326f8e73d21a8bc746695f8d15e12e2016");
      }

      const allNFTs = await NFTService.getAllNFTsFromMultipleUsers(allAddresses);
      setNfts(allNFTs);

      // Resolve display names for all unique addresses
      const addresses = new Set<string>();
      allNFTs.forEach(nft => {
        addresses.add(nft.owner);
        addresses.add(nft.creator);
      });

      const newDisplayNames: Record<string, string> = {};
      const addressArray = Array.from(addresses);
      for (const address of addressArray) {
        newDisplayNames[address] = await getDisplayName(address);
      }
      setDisplayNames(newDisplayNames);

    } catch (error) {
      console.error('Error fetching NFTs:', error);
      // Fallback to empty arrays instead of showing error to user
      setNfts([]);
      setUserNFTs([]);
    } finally {
      setIsLoading(false);
    }
  }, [connected, account, getDisplayName]);

  const purchaseNFT = async (nft: BlockchainNFT) => {
    if (!connected || !account) return;

    // Can't purchase your own NFT
    if (nft.owner === account.address) {
      alert("You can't purchase your own NFT!");
      return;
    }

    setPurchaseLoading(nft.id);
    try {
      const payload = {
        function: PURCHASE_FUNCTION,
        functionArguments: [
          nft.owner,
          nft.id.toString(),
        ],
      };

      const response = await signAndSubmitTransaction({ data: payload } as any);
      console.log('Purchase transaction submitted:', response);
      alert('NFT purchased successfully!');
      fetchNFTs(); // Refresh the gallery
    } catch (error: any) {
      console.error('Error purchasing NFT:', error);
      alert(`Failed to purchase NFT: ${error?.message || 'Unknown error'}`);
    } finally {
      setPurchaseLoading(null);
    }
  };

  const deleteNFT = async (nft: BlockchainNFT) => {
    if (!connected || !account) return;

    // Can only delete your own NFTs
    if (nft.owner !== account.address) {
      alert("You can only delete your own NFTs!");
      return;
    }

    // Confirmation dialog
    if (!window.confirm(`Are you sure you want to delete "${nft.metadata.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(nft.id);
    try {
      const payload = {
        function: DELETE_FUNCTION,
        functionArguments: [
          nft.id.toString(),
        ],
      };

      const response = await signAndSubmitTransaction({ data: payload } as any);
      console.log('Delete transaction submitted:', response);
      alert('NFT deleted successfully!');
      fetchNFTs(); // Refresh the gallery
    } catch (error: any) {
      console.error('Error deleting NFT:', error);
      alert(`Failed to delete NFT: ${error?.message || 'Unknown error'}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    fetchNFTs();
    
    // Listen for mint events to auto-refresh
    const handleNFTMinted = () => {
      setTimeout(() => fetchNFTs(), 2000); // Delay to allow blockchain to update
    };
    
    window.addEventListener('nftMinted', handleNFTMinted);
    
    return () => {
      window.removeEventListener('nftMinted', handleNFTMinted);
    };
  }, [fetchNFTs]);

  const displayNFTs = activeTab === 'mine' ? userNFTs : nfts;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">NFT Gallery</h2>
          <p className="text-gray-500 dark:text-gray-400">Discover and purchase meme NFTs</p>
        </div>
        <button
          onClick={fetchNFTs}
          className="btn-secondary flex items-center space-x-2"
          disabled={isLoading}
        >
          <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
        </button>
      </div>

      {!connected ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Connect your wallet to view NFTs</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              All NFTs ({nfts.length})
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'mine'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              My NFTs ({userNFTs.length})
            </button>
          </div>

          {/* NFT Grid */}
          {displayNFTs.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <EyeIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                {activeTab === 'mine' ? 'You haven\'t minted any NFTs yet' : 'No NFTs found'}
              </p>
              <p className="text-sm text-gray-400">
                {activeTab === 'mine' ? 'Mint your first meme NFT to get started!' : 'Be the first to mint an NFT!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayNFTs.map((nft) => (
                <div
                  key={`${nft.owner}-${nft.id}`}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
                >
                  {/* NFT Image */}
                  <div className="aspect-square bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    {nft.metadata.image ? (
                      <>
                        <img 
                          src={IPFSService.isLocalImage(nft.metadata.image) 
                            ? IPFSService.getLocalImage(nft.metadata.image) || nft.metadata.image
                            : nft.metadata.image
                          } 
                          alt={nft.metadata.name}
                          className="w-full h-full object-cover"
                          onLoad={(e) => {
                            // Hide the fallback when image loads successfully
                            const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'none';
                          }}
                          onError={(e) => {
                            // Show fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                          {nft.metadata.name.charAt(0).toUpperCase()}
                        </div>
                      </>
                    ) : (
                      <div className="text-white text-2xl font-bold">
                        {nft.metadata.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  {/* NFT Details */}
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                    {nft.metadata.name}
                  </h3>
                  
                  {nft.metadata.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {nft.metadata.description}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Creator: {displayNames[nft.creator] || formatAddress(nft.creator)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Owner: {displayNames[nft.owner] || formatAddress(nft.owner)}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {formatPrice(nft.mint_price)} APT
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="View details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      {nft.owner !== account?.address ? (
                        <button
                          onClick={() => purchaseNFT(nft)}
                          disabled={purchaseLoading === nft.id}
                          className="p-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors disabled:opacity-50"
                          title="Purchase NFT"
                        >
                          {purchaseLoading === nft.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 dark:border-primary-400"></div>
                          ) : (
                            <ShoppingCartIcon className="w-5 h-5" />
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => deleteNFT(nft)}
                          disabled={deleteLoading === nft.id}
                          className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                          title="Delete NFT"
                        >
                          {deleteLoading === nft.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 dark:border-red-400"></div>
                          ) : (
                            <TrashIcon className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
