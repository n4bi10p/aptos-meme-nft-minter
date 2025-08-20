// Meme categories and tags system
export interface MemeCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface MemeTag {
  id: string;
  name: string;
  category?: string;
  count: number;
}

export class CategoriesService {
  static readonly DEFAULT_CATEGORIES: MemeCategory[] = [
    { id: 'funny', name: 'Funny', emoji: '😂', description: 'Hilarious and comedy memes' },
    { id: 'reaction', name: 'Reaction', emoji: '😮', description: 'Perfect for reactions' },
    { id: 'cute', name: 'Cute', emoji: '🥰', description: 'Adorable and wholesome' },
    { id: 'crypto', name: 'Crypto', emoji: '₿', description: 'Cryptocurrency and DeFi related' },
    { id: 'gaming', name: 'Gaming', emoji: '🎮', description: 'Video game memes' },
    { id: 'art', name: 'Art', emoji: '🎨', description: 'Artistic and creative' },
    { id: 'trending', name: 'Trending', emoji: '🔥', description: 'Hot and viral memes' },
    { id: 'random', name: 'Random', emoji: '🎲', description: 'Miscellaneous and random' }
  ];

  static readonly POPULAR_TAGS: string[] = [
    'lol', 'epic', 'wow', 'mood', 'relatable', 'nostalgia', 'weekend', 'work',
    'hodl', 'moon', 'diamond-hands', 'ape', 'degen', 'gm', 'wagmi', 'ngmi',
    'rare', 'legendary', 'common', 'based', 'cringe', 'blessed', 'cursed',
    'viral', 'fire', 'goat', 'facts', 'no-cap', 'sus', 'salty', 'toxic'
  ];

  /**
   * Get all available categories
   */
  static getCategories(): MemeCategory[] {
    return this.DEFAULT_CATEGORIES;
  }

  /**
   * Get category by ID
   */
  static getCategoryById(id: string): MemeCategory | undefined {
    return this.DEFAULT_CATEGORIES.find(cat => cat.id === id);
  }

  /**
   * Get popular tags with usage count
   */
  static getPopularTags(): MemeTag[] {
    const tagCounts = this.getTagCounts();
    
    return this.POPULAR_TAGS.map(tag => ({
      id: tag,
      name: tag,
      count: tagCounts[tag] || 0
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Add tags to an NFT
   */
  static addTagsToNFT(nftId: string, tags: string[]): void {
    const nftTags = this.getNFTTags();
    nftTags[nftId] = tags.map(tag => tag.toLowerCase().trim()).filter(Boolean);
    localStorage.setItem('nft_tags', JSON.stringify(nftTags));
    
    // Update tag counts
    this.updateTagCounts(tags);
  }

  /**
   * Get tags for a specific NFT
   */
  static getNFTTagsById(nftId: string): string[] {
    const nftTags = this.getNFTTags();
    return nftTags[nftId] || [];
  }

  /**
   * Search NFTs by category
   */
  static searchByCategory(category: string): string[] {
    const nftCategories = this.getNFTCategories();
    return Object.keys(nftCategories).filter(nftId => nftCategories[nftId] === category);
  }

  /**
   * Search NFTs by tags
   */
  static searchByTags(tags: string[]): string[] {
    const nftTags = this.getNFTTags();
    const searchTags = tags.map(tag => tag.toLowerCase());
    
    return Object.keys(nftTags).filter(nftId => {
      const nftTagList = nftTags[nftId];
      return searchTags.some(searchTag => nftTagList.includes(searchTag));
    });
  }

  /**
   * Add category to NFT
   */
  static addCategoryToNFT(nftId: string, categoryId: string): void {
    const nftCategories = this.getNFTCategories();
    nftCategories[nftId] = categoryId;
    localStorage.setItem('nft_categories', JSON.stringify(nftCategories));
  }

  /**
   * Get category for a specific NFT
   */
  static getNFTCategory(nftId: string): string | undefined {
    const nftCategories = this.getNFTCategories();
    return nftCategories[nftId];
  }

  /**
   * Get suggested tags based on input
   */
  static getSuggestedTags(input: string): string[] {
    const inputLower = input.toLowerCase();
    return this.POPULAR_TAGS
      .filter(tag => tag.includes(inputLower))
      .slice(0, 5);
  }

  // Private helper methods
  private static getNFTTags(): Record<string, string[]> {
    try {
      const stored = localStorage.getItem('nft_tags');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private static getNFTCategories(): Record<string, string> {
    try {
      const stored = localStorage.getItem('nft_categories');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private static getTagCounts(): Record<string, number> {
    try {
      const stored = localStorage.getItem('tag_counts');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private static updateTagCounts(tags: string[]): void {
    const tagCounts = this.getTagCounts();
    tags.forEach(tag => {
      const normalizedTag = tag.toLowerCase().trim();
      tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
    });
    localStorage.setItem('tag_counts', JSON.stringify(tagCounts));
  }
}
