import React, { useState, useEffect } from 'react';
import { TagIcon, FunnelIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CategoriesService, MemeCategory, MemeTag } from '../services/categories';

interface CategoriesAndTagsProps {
  selectedCategory: string;
  selectedTags: string[];
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
}

export const CategoriesAndTags: React.FC<CategoriesAndTagsProps> = ({
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagsChange
}) => {
  const [categories] = useState<MemeCategory[]>(CategoriesService.getCategories());
  const [popularTags, setPopularTags] = useState<MemeTag[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setPopularTags(CategoriesService.getPopularTags());
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(selectedCategory === categoryId ? '' : categoryId);
  };

  const handleTagToggle = (tagName: string) => {
    const normalizedTag = tagName.toLowerCase().trim();
    if (selectedTags.includes(normalizedTag)) {
      onTagsChange(selectedTags.filter(tag => tag !== normalizedTag));
    } else if (selectedTags.length < 5) {
      onTagsChange([...selectedTags, normalizedTag]);
    }
  };

  const handleCustomTagInput = (value: string) => {
    setCustomTagInput(value);
    if (value.length > 0) {
      const suggestedTags = CategoriesService.getSuggestedTags(value);
      setSuggestions(suggestedTags.filter(tag => !selectedTags.includes(tag)));
    } else {
      setSuggestions([]);
    }
  };

  const addCustomTag = (tag?: string) => {
    const tagToAdd = tag || customTagInput.toLowerCase().trim();
    if (tagToAdd && !selectedTags.includes(tagToAdd) && selectedTags.length < 5) {
      onTagsChange([...selectedTags, tagToAdd]);
      setCustomTagInput('');
      setSuggestions([]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <FunnelIcon className="w-4 h-4 text-gray-500" />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
              }`}
              title={category.description}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">{category.emoji}</span>
                <span className="text-xs">{category.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <TagIcon className="w-4 h-4 text-gray-500" />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags (max 5)
          </label>
          <span className="text-xs text-gray-500">
            {selectedTags.length}/5
          </span>
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-full text-sm"
              >
                <span>#{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Custom Tag Input */}
        <div className="relative mb-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => handleCustomTagInput(e.target.value)}
              placeholder="Add custom tag..."
              className="input-field flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
              disabled={selectedTags.length >= 5}
            />
            <button
              onClick={() => addCustomTag()}
              disabled={!customTagInput.trim() || selectedTags.length >= 5}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => addCustomTag(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                >
                  #{suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Tags */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Popular tags:</p>
          <div className="flex flex-wrap gap-2">
            {popularTags.slice(0, 12).map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.name)}
                disabled={selectedTags.length >= 5 && !selectedTags.includes(tag.name)}
                className={`px-2 py-1 rounded text-xs transition-all duration-200 ${
                  selectedTags.includes(tag.name)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                #{tag.name}
                {tag.count > 0 && (
                  <span className="ml-1 opacity-75">({tag.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
