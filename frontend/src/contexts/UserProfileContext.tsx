import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

interface UserProfile {
  address: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  isSettingUp: boolean;
  setupProfile: (username: string, avatar?: string, bio?: string) => Promise<boolean>;
  updateProfile: (updates: Partial<Omit<UserProfile, 'address' | 'createdAt'>>) => Promise<boolean>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  getUserProfile: (address: string) => Promise<UserProfile | null>;
  getDisplayName: (address: string) => Promise<string>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { account, connected } = useWallet();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);

  // Load profile when wallet connects
  useEffect(() => {
    if (connected && account?.address) {
      loadProfile(account.address);
    } else {
      setProfile(null);
    }
  }, [connected, account?.address]);

  const loadProfile = async (address: string) => {
    try {
      console.log('Loading profile for address:', address);
      const existingProfile = await getUserProfile(address);
      console.log('Loaded profile:', existingProfile);
      setProfile(existingProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const setupProfile = async (username: string, avatar?: string, bio?: string): Promise<boolean> => {
    if (!account?.address) return false;

    setIsSettingUp(true);
    try {
      // Check username availability
      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }

      const newProfile: UserProfile = {
        address: account.address,
        username: username.trim(),
        avatar,
        bio,
        createdAt: new Date().toISOString()
      };

      // Store in localStorage (in production, use a backend service)
      const profiles = getStoredProfiles();
      profiles[account.address] = newProfile;
      localStorage.setItem('userProfiles', JSON.stringify(profiles));
      console.log('Stored profile:', newProfile);
      console.log('All profiles:', profiles);

      // Also store username mapping for quick lookup
      const usernames = getStoredUsernames();
      usernames[username.toLowerCase()] = account.address;
      localStorage.setItem('usernames', JSON.stringify(usernames));
      console.log('Stored usernames mapping:', usernames);

      setProfile(newProfile);
      return true;
    } catch (error) {
      console.error('Error setting up profile:', error);
      return false;
    } finally {
      setIsSettingUp(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'address' | 'createdAt'>>): Promise<boolean> => {
    if (!profile || !account?.address) return false;

    try {
      // If username is being updated, check availability
      if (updates.username && updates.username !== profile.username) {
        const isAvailable = await checkUsernameAvailability(updates.username);
        if (!isAvailable) {
          throw new Error('Username is already taken');
        }

        // Update username mapping
        const usernames = getStoredUsernames();
        delete usernames[profile.username.toLowerCase()];
        usernames[updates.username.toLowerCase()] = account.address;
        localStorage.setItem('usernames', JSON.stringify(usernames));
      }

      const updatedProfile = { ...profile, ...updates };
      
      const profiles = getStoredProfiles();
      profiles[account.address] = updatedProfile;
      localStorage.setItem('userProfiles', JSON.stringify(profiles));

      setProfile(updatedProfile);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    const usernames = getStoredUsernames();
    const normalizedUsername = username.toLowerCase().trim();
    
    // Check if username already exists
    if (usernames[normalizedUsername]) {
      // If it's the current user's username, it's available for them
      return usernames[normalizedUsername] === account?.address;
    }
    
    // Additional validation
    if (normalizedUsername.length < 3 || normalizedUsername.length > 20) {
      throw new Error('Username must be between 3 and 20 characters');
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }

    return true;
  };

  const getUserProfile = async (address: string): Promise<UserProfile | null> => {
    const profiles = getStoredProfiles();
    const profile = profiles[address] || null;
    console.log('Getting profile for address:', address);
    console.log('Found profile:', profile);
    console.log('All stored profiles:', profiles);
    return profile;
  };

  const getDisplayName = async (address: string): Promise<string> => {
    const profile = await getUserProfile(address);
    if (profile?.username) {
      return profile.username;
    }
    
    // Return shortened address if no username
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Helper functions
  const getStoredProfiles = (): Record<string, UserProfile> => {
    try {
      const stored = localStorage.getItem('userProfiles');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const getStoredUsernames = (): Record<string, string> => {
    try {
      const stored = localStorage.getItem('usernames');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const value: UserProfileContextType = {
    profile,
    isSettingUp,
    setupProfile,
    updateProfile,
    checkUsernameAvailability,
    getUserProfile,
    getDisplayName
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
