// Duplicate detection service
export class DuplicateDetectionService {
  private static readonly STORAGE_KEY = 'meme_image_hashes';

  /**
   * Check if an image hash already exists
   */
  static async isDuplicate(imageHash: string): Promise<boolean> {
    const storedHashes = this.getStoredHashes();
    return storedHashes.includes(imageHash);
  }

  /**
   * Add a new image hash to storage
   */
  static addImageHash(imageHash: string, metadata?: {
    fileName: string;
    uploadedAt: string;
    userAddress: string;
  }): void {
    const storedHashes = this.getStoredHashes();
    const detailedHashes = this.getDetailedHashes();
    
    if (!storedHashes.includes(imageHash)) {
      storedHashes.push(imageHash);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedHashes));
      
      if (metadata) {
        detailedHashes[imageHash] = metadata;
        localStorage.setItem(`${this.STORAGE_KEY}_detailed`, JSON.stringify(detailedHashes));
      }
    }
  }

  /**
   * Get all stored image hashes
   */
  static getStoredHashes(): string[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get detailed hash information
   */
  static getDetailedHashes(): Record<string, {
    fileName: string;
    uploadedAt: string;
    userAddress: string;
  }> {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_detailed`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Get information about a duplicate image
   */
  static getDuplicateInfo(imageHash: string): {
    fileName: string;
    uploadedAt: string;
    userAddress: string;
  } | null {
    const detailedHashes = this.getDetailedHashes();
    return detailedHashes[imageHash] || null;
  }

  /**
   * Remove an image hash (e.g., when NFT is deleted)
   */
  static removeImageHash(imageHash: string): void {
    const storedHashes = this.getStoredHashes();
    const detailedHashes = this.getDetailedHashes();
    
    const index = storedHashes.indexOf(imageHash);
    if (index > -1) {
      storedHashes.splice(index, 1);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedHashes));
    }

    delete detailedHashes[imageHash];
    localStorage.setItem(`${this.STORAGE_KEY}_detailed`, JSON.stringify(detailedHashes));
  }

  /**
   * Clear all stored hashes (for testing or reset)
   */
  static clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(`${this.STORAGE_KEY}_detailed`);
  }
}
