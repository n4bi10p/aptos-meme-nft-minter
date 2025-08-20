// Utility functions for parsing NFT metadata

export interface ParsedNFTMetadata {
  name: string;
  description?: string;
  image?: string;
}

export function parseNFTMetadata(nameField: string): ParsedNFTMetadata {
  console.log('Parsing NFT metadata from:', nameField); // Debug log
  
  try {
    // Try to parse as JSON first (new format)
    const parsed = JSON.parse(nameField);
    console.log('Parsed JSON metadata:', parsed); // Debug log
    
    if (parsed.name || parsed.description || parsed.image) {
      return {
        name: parsed.name || 'Untitled Meme',
        description: parsed.description,
        image: parsed.image
      };
    }
  } catch (error) {
    console.log('JSON parsing failed, treating as string:', error); // Debug log
  }
  
  // Fallback to treating the entire field as just the name
  return {
    name: nameField || 'Untitled Meme'
  };
}

export function createNFTMetadata(name: string, description: string, imageUri: string): string {
  return JSON.stringify({
    name,
    description,
    image: imageUri
  });
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatPrice(priceInOctas: number): string {
  return (priceInOctas / 100000000).toFixed(2);
}
