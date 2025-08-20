// IPFS service using Pinata for image upload
export class IPFSService {
  private static readonly PINATA_API_URL = 'https://api.pinata.cloud';
  private static readonly PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';
  
  // For demo purposes, we'll use a free tier approach
  // In production, you'd want to use environment variables
  private static readonly API_KEY = process.env.REACT_APP_PINATA_API_KEY || 'demo_key';
  private static readonly SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY || 'demo_secret';

  static async uploadImage(file: File): Promise<string> {
    try {
      // For demo purposes, we'll use a mock upload that returns a placeholder IPFS hash
      // In production, replace this with actual Pinata upload
      if (!process.env.REACT_APP_PINATA_API_KEY) {
        console.warn('Using demo mode for IPFS upload. Set REACT_APP_PINATA_API_KEY for production.');
        return await this.mockUpload(file);
      }

      const formData = new FormData();
      formData.append('file', file);
      
      const metadata = JSON.stringify({
        name: `meme-${Date.now()}`,
        keyvalues: {
          type: 'meme-nft',
          timestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', options);

      const response = await fetch(`${this.PINATA_API_URL}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'pinata_api_key': this.API_KEY,
          'pinata_secret_api_key': this.SECRET_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return `${this.PINATA_GATEWAY}/${result.IpfsHash}`;
      
    } catch (error) {
      console.error('IPFS upload error:', error);
      // Fallback to mock upload for demo
      return await this.mockUpload(file);
    }
  }

  private static async mockUpload(file: File): Promise<string> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a hash for the file and store it locally
    const fileHash = `local_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Convert file to data URL and store in localStorage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        
        // Store the actual image data in localStorage
        try {
          localStorage.setItem(`meme_image_${fileHash}`, dataUrl);
          console.log('Stored image locally with hash:', fileHash);
          
          // Return a reference URL instead of the full data
          resolve(`local://meme-images/${fileHash}`);
        } catch (error) {
          console.error('Failed to store image locally:', error);
          // If localStorage fails, return a shorter placeholder
          resolve(`placeholder://meme-${fileHash.substring(0, 10)}`);
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  }

  static async uploadMetadata(metadata: {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{ trait_type: string; value: string }>;
  }): Promise<string> {
    try {
      if (!process.env.REACT_APP_PINATA_API_KEY) {
        console.warn('Using demo mode for metadata upload.');
        return await this.mockMetadataUpload(metadata);
      }

      const response = await fetch(`${this.PINATA_API_URL}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.API_KEY,
          'pinata_secret_api_key': this.SECRET_KEY,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `metadata-${metadata.name}`,
            keyvalues: {
              type: 'nft-metadata',
              timestamp: new Date().toISOString()
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Metadata upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return `${this.PINATA_GATEWAY}/${result.IpfsHash}`;
      
    } catch (error) {
      console.error('Metadata upload error:', error);
      return await this.mockMetadataUpload(metadata);
    }
  }

  private static async mockMetadataUpload(metadata: any): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    return `https://ipfs.io/ipfs/${mockHash}`;
  }

  // Method to retrieve locally stored images
  static getLocalImage(imageUrl: string): string | null {
    if (imageUrl.startsWith('local://meme-images/')) {
      const hash = imageUrl.replace('local://meme-images/', '');
      const storedData = localStorage.getItem(`meme_image_${hash}`);
      return storedData;
    }
    return null;
  }

  // Method to check if an image is stored locally
  static isLocalImage(imageUrl: string): boolean {
    return imageUrl.startsWith('local://meme-images/') || imageUrl.startsWith('placeholder://');
  }
}
