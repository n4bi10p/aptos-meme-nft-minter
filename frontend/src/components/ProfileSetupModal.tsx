import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from './WalletSelector';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ 
  isOpen, 
  onClose, 
  onComplete 
}) => {
  const { setupProfile, updateProfile, checkUsernameAvailability, isSettingUp, profile } = useUserProfile();
  const { connected, account } = useWallet();
  const [formData, setFormData] = useState({
    username: '',
    bio: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (profile) {
        // Edit mode - populate with existing data
        setIsEditMode(true);
        setFormData({ 
          username: profile.username || '', 
          bio: profile.bio || '' 
        });
      } else {
        // Create mode - reset form
        setIsEditMode(false);
        setFormData({ username: '', bio: '' });
      }
      setErrors({});
      setUsernameAvailable(null);
    }
  }, [isOpen, profile]);

  // Check username availability with debounce
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      // If editing and username hasn't changed, it's available
      if (isEditMode && profile && formData.username === profile.username) {
        setUsernameAvailable(true);
        setErrors(prev => ({ ...prev, username: '' }));
        return;
      }

      setIsCheckingUsername(true);
      try {
        const available = await checkUsernameAvailability(formData.username);
        setUsernameAvailable(available);
        if (!available) {
          setErrors(prev => ({ ...prev, username: 'Username is already taken' }));
        } else {
          setErrors(prev => ({ ...prev, username: '' }));
        }
      } catch (error: any) {
        setErrors(prev => ({ ...prev, username: error.message }));
        setUsernameAvailable(false);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username, checkUsernameAvailability, isEditMode, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !account) {
      setErrors({ general: 'Please connect your wallet first' });
      return;
    }
    
    if (!formData.username || usernameAvailable !== true) {
      return;
    }

    try {
      let success;
      if (isEditMode && profile) {
        // Update existing profile
        success = await updateProfile({
          username: formData.username,
          bio: formData.bio
        });
      } else {
        // Create new profile
        success = await setupProfile(formData.username, undefined, formData.bio);
      }
      
      if (success) {
        onComplete();
        onClose();
      } else {
        setErrors({ general: `Failed to ${isEditMode ? 'update' : 'create'} profile. Please try again.` });
      }
    } catch (error: any) {
      setErrors({ general: error.message || `Failed to ${isEditMode ? 'update' : 'create'} profile` });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isEditMode ? 'Edit Your Profile' : 'Setup Your Profile'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEditMode ? 'Update your profile information' : 'Choose a username to personalize your NFTs'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Wallet Connection Status */}
        {!connected ? (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Wallet Required
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Connect your Aptos wallet to create or edit your profile
                </p>
              </div>
              <div className="ml-4">
                <WalletSelector />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Connected: {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" style={{ opacity: connected ? 1 : 0.6 }}>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Choose a unique username"
                className={`input-field pr-10 ${
                  errors.username ? 'border-red-500' : 
                  usernameAvailable === true ? 'border-green-500' : ''
                }`}
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
                disabled={!connected}
              />
              
              {/* Username validation indicator */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isCheckingUsername && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                )}
                {!isCheckingUsername && usernameAvailable === true && (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                )}
                {!isCheckingUsername && usernameAvailable === false && (
                  <XMarkIcon className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio (Optional)
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="input-field resize-none"
              rows={3}
              maxLength={200}
              disabled={!connected}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.bio.length}/200 characters
            </p>
          </div>

          {/* Error display */}
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-700 dark:text-red-300 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isEditMode ? 'Cancel' : 'Skip for now'}
            </button>
            <button
              type="submit"
              disabled={!connected || !formData.username || usernameAvailable !== true || isSettingUp}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSettingUp ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Profile' : 'Create Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
