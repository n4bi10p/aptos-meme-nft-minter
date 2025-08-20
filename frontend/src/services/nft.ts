import { APTOS_RPC_URL, CONTRACT_ADDRESS } from '../config/constants';
import { parseNFTMetadata, ParsedNFTMetadata } from '../utils/nft';

export interface BlockchainNFT {
  id: number;
  metadata: ParsedNFTMetadata;
  creator: string;
  mint_price: number;
  owner: string;
  raw_name: string;
}

export class NFTService {
  
  static async fetchUserNFTs(userAddress: string): Promise<BlockchainNFT[]> {
    try {
      console.log('Fetching NFTs for address:', userAddress);
      console.log('Using contract address:', CONTRACT_ADDRESS);
      
      // Query the user's NFT collection resource
      const response = await fetch(
        `${APTOS_RPC_URL}/accounts/${userAddress}/resource/${CONTRACT_ADDRESS}::MemeNFTMinter::NFTCollection`
      );

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 404) {
          // User doesn't have any NFTs yet
          console.log('No NFT collection found for user (404) - user has no NFTs yet');
          return [];
        }
        throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
      }

      const resourceData = await response.json();
      const nfts = resourceData.data?.nfts || [];

      console.log('Raw NFT data from blockchain:', nfts); // Debug log
      console.log('Contract address being queried:', CONTRACT_ADDRESS); // Debug log

      return nfts.map((nft: any, index: number) => {
        console.log('Processing NFT:', nft); // Debug each NFT
        const mintPrice = parseInt(nft.mint_price) || 0;
        console.log(`NFT ${nft.name} raw mint_price: "${nft.mint_price}" (type: ${typeof nft.mint_price}), parsed as: ${mintPrice}`); // Enhanced debug log
        
        return {
          id: parseInt(nft.id) || index + 1,
          metadata: {
            name: nft.name,
            description: nft.description,
            image: nft.image_uri
          },
          creator: nft.creator,
          mint_price: mintPrice,
          owner: userAddress,
          raw_name: nft.name
        };
      });

    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return [];
    }
  }

  static async fetchAllNFTs(): Promise<BlockchainNFT[]> {
    try {
      // For now, we'll fetch a few known accounts
      // In a real app, you'd have an indexer or query all accounts
      const knownAccounts = [
        CONTRACT_ADDRESS, // Contract owner might have NFTs
        // Add more known addresses here
      ];

      const allNFTs: BlockchainNFT[] = [];

      for (const address of knownAccounts) {
        try {
          const userNFTs = await this.fetchUserNFTs(address);
          allNFTs.push(...userNFTs);
        } catch (error) {
          console.error(`Error fetching NFTs for ${address}:`, error);
        }
      }

      return allNFTs;
    } catch (error) {
      console.error('Error fetching all NFTs:', error);
      return [];
    }
  }

  static async getAllNFTsFromMultipleUsers(addresses: string[]): Promise<BlockchainNFT[]> {
    const allNFTs: BlockchainNFT[] = [];
    
    for (const address of addresses) {
      try {
        const userNFTs = await this.fetchUserNFTs(address);
        allNFTs.push(...userNFTs);
      } catch (error) {
        console.error(`Error fetching NFTs for ${address}:`, error);
      }
    }

    return allNFTs;
  }

  // Helper function to get account resource
  static async getAccountResource(address: string, resourceType: string): Promise<any> {
    try {
      const response = await fetch(`${APTOS_RPC_URL}/accounts/${address}/resource/${resourceType}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Resource doesn't exist
        }
        throw new Error(`Failed to fetch resource: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching account resource:', error);
      return null;
    }
  }
}
