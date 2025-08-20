# Meme NFT Minter - Enhanced Platform

A comprehensive, feature-rich meme NFT minting platform built on Aptos blockchain with modern Web3 UX and advanced creator tools.

## ✨ Key Features

### 🎨 **Beautiful macOS-Style UI**
- Claude AI-inspired typography and design system
- Glass morphism effects and smooth animations
- Dark/Light theme support
- Responsive design for all devices

### � **User Profile System**
- **Custom Usernames**: Replace wallet addresses with memorable usernames
- **Profile Setup Modal**: Guided onboarding for new users
- **Real-time Username Validation**: Duplicate detection and availability checking
- **Profile Management**: Update username, bio, and avatar anytime
- **Creator Recognition**: NFTs display creator usernames instead of addresses

### 📱 **Advanced Wallet Integration**
- Support for Petra and Pontem wallets
- Seamless connection/disconnection
- Auto-reconnection on page refresh
- Profile persistence across sessions

### 🖼️ **Smart Image Processing**
- **Automatic Compression**: Reduces file sizes by 30-70% while maintaining quality
- **Size Optimization**: Compresses images larger than 500KB or 1024x1024 pixels
- **Format Support**: JPEG, PNG, GIF, and WebP
- **Visual Feedback**: Shows compression savings to users
- **Quality Control**: Maintains 80% quality for optimal balance

### 🔍 **Duplicate Detection System**
- **SHA-256 Hashing**: Creates unique fingerprints for each image
- **Real-time Detection**: Prevents uploading duplicate memes
- **Duplicate Alerts**: Shows when and who previously uploaded the same image
- **Hash Database**: Maintains record of all uploaded image hashes

### 🏷️ **Categories & Tags System**
- **8 Predefined Categories** with emoji indicators:
  - 😂 Funny - Comedy and hilarious memes
  - 😮 Reaction - Perfect reaction memes
  - 🥰 Cute - Adorable and wholesome content
  - ₿ Crypto - Cryptocurrency and DeFi related
  - 🎮 Gaming - Video game memes
  - 🎨 Art - Artistic and creative content
  - 🔥 Trending - Hot and viral memes
  - 🎲 Random - Miscellaneous content
- **Custom Tags**: Add up to 5 custom tags per NFT
- **Smart Suggestions**: Popular tag recommendations while typing
- **Enhanced Discovery**: Filter and search by categories and tags

### 🚀 **NFT Marketplace**
- Mint unique meme NFTs with custom metadata
- Buy and sell NFTs with APT cryptocurrency
- Gallery view with username display
- Enhanced search and filtering capabilities

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Aptos TS SDK for smart contract interactions
- **Wallet**: Aptos Wallet Adapter for connection management
- **Icons**: Heroicons & Lucide React
- **Storage**: IPFS for decentralized image storage
- **Local Data**: Browser localStorage (production-ready for backend migration)

## 🚀 Getting Started

### Prerequisites
1. **Install a supported Aptos wallet**:
   - [Petra Wallet](https://petra.app/) (Recommended)
   - [Pontem Wallet](https://pontem.network/pontem-wallet)

2. **Setup Aptos Devnet**:
   - Switch your wallet to Aptos Devnet
   - Get test APT from the [Aptos Faucet](https://api.devnet.aptoslabs.com/v1)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/n4bi10p/aptos-meme-nft-minter.git
cd aptos-meme-nft-minter/frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm start
```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### First-Time Setup
1. **Connect your wallet** using the "Connect Wallet" button
2. **Create your username** in the profile setup modal
3. **Complete your profile** with optional bio and avatar
4. **Start minting** your meme NFTs!

## 📱 How to Use

### Creating Your First NFT
1. **Upload Image**: Drag & drop or select your meme image
   - Automatic compression for large files
   - Duplicate detection prevents re-uploading existing memes
2. **Choose Category**: Select from 8 predefined categories
3. **Add Tags**: Use up to 5 custom tags for better discoverability
4. **Set Details**: Add name, description, and price
5. **Mint NFT**: Confirm transaction in your wallet

### Profile Management
- **Edit Profile**: Click the profile icon in the header
- **Update Username**: Change your display name (must be unique)
- **Add Bio**: Tell others about yourself
- **Set Avatar**: Upload a profile picture

### Browsing NFTs
- **Gallery View**: Browse all minted NFTs
- **Filter by Category**: Use category buttons to filter
- **Search by Tags**: Find specific content
- **Creator Names**: See actual usernames instead of wallet addresses

## 🏗️ Smart Contract

The platform interacts with deployed Aptos smart contracts:
- **Contract Address**: `0x78e94c45fc12dee96330084c307ac3e06ecb854f25254ea0fcd215732dc1a75e`
- **Modules**: 
  - `SimpleMemeNFT` - Basic NFT functionality
  - `MemeNFTMinter` - Enhanced minting with metadata
  - `MemeNFTMinterV2` - Latest version with advanced features

## 🔧 Development

### Project Structure
```
frontend/src/
├── components/           # React components
│   ├── CategoriesAndTags.tsx    # Category & tag selection
│   ├── ProfileSetupModal.tsx    # User profile setup
│   ├── ImageUpload.tsx          # Enhanced image upload
│   ├── MintNFT.tsx             # NFT minting form
│   ├── NFTGallery.tsx          # NFT gallery display
│   ├── Header.tsx              # Navigation header
│   └── WalletSelector.tsx      # Wallet connection
├── contexts/            # React contexts
│   ├── UserProfileContext.tsx  # Profile state management
│   ├── WalletContext.tsx       # Wallet state
│   └── ThemeContext.tsx        # Theme management
├── services/            # Business logic
│   ├── categories.ts           # Category & tag management
│   ├── duplicateDetection.ts   # Image duplicate detection
│   ├── ipfs.ts                # IPFS upload handling
│   └── nft.ts                 # NFT operations
└── utils/              # Utility functions
    ├── imageProcessor.ts       # Image compression
    └── nft.ts                 # NFT helper functions
```

### Available Scripts

- **`npm start`** - Runs the app in development mode
- **`npm test`** - Launches the test runner in interactive watch mode
- **`npm run build`** - Builds the app for production to the `build` folder
- **`npm run eject`** - Ejects from Create React App (⚠️ one-way operation)

## 🎨 Design System

The platform features a carefully crafted design system:

### Visual Design
- **Color Palette**: Primary blues with elegant grays
- **Typography**: Claude AI-inspired system fonts
- **Components**: Glass morphism effects and rounded corners
- **Animations**: Smooth transitions and hover effects
- **Theme Support**: Light and dark modes

### User Experience
- **Onboarding Flow**: Guided setup for new users
- **Visual Feedback**: Real-time validation and status updates
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile-First**: Responsive design for all screen sizes

## 🔒 Security & Validation

### Data Protection
- **Client-Side Storage**: Secure localStorage implementation
- **Input Validation**: Comprehensive validation for all user inputs
- **Error Handling**: Graceful error recovery and user feedback
- **Hash-Based Detection**: SHA-256 for reliable duplicate detection

### Validation Rules
- **Usernames**: 3-20 characters, alphanumeric + underscore only
- **Images**: File type, size, and format validation
- **Tags**: Length limits and character restrictions
- **Metadata**: Required field validation

## 🚀 Future Roadmap

### Planned Enhancements
- **Backend Integration**: Replace localStorage with proper database
- **Advanced Search**: Full-text search across metadata
- **Social Features**: Follow creators, likes, and comments
- **Trending Algorithm**: Dynamic content discovery
- **Enhanced IPFS**: Improved pinning and redundancy
- **Mobile App**: React Native implementation

### Performance Improvements
- **Database Optimization**: Proper indexing for search
- **CDN Integration**: Faster global image delivery
- **Batch Operations**: Bulk data processing
- **Caching Layer**: Redis for frequently accessed data

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Write TypeScript with proper type definitions
- Follow the existing code style and patterns
- Add tests for new functionality
- Update documentation for new features
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Aptos Labs** for the excellent blockchain infrastructure
- **The Meme Community** for inspiration and creativity
- **Open Source Contributors** who make projects like this possible

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/n4bi10p/aptos-meme-nft-minter/issues)
- **Documentation**: Check the [Enhanced Features Guide](ENHANCED_FEATURES.md)
- **Community**: Join our discussions in the repository

---

**Made with ❤️ for the meme community on Aptos blockchain**
