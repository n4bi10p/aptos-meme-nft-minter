module meme_nft::MemeNFTMinterV2 {

    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use std::string::String;
    use std::vector;

    /// Struct representing a Meme NFT with image support
    struct MemeNFTV2 has store, drop, copy {
        id: u64,           // Unique identifier for the NFT
        name: String,      // Name of the meme NFT
        description: String, // Caption/description of the meme
        image_uri: String, // IPFS URI of the meme image
        creator: address,  // Address of the NFT creator
        mint_price: u64,   // Price required to mint this NFT
    }

    /// Collection to hold multiple NFTs for an account
    struct NFTCollectionV2 has key {
        nfts: vector<MemeNFTV2>,
        counter: u64,
    }

    /// Function to create and mint a new Meme NFT with image
    public entry fun mint_meme_nft_v2(
        creator: &signer, 
        name: String,
        description: String,
        image_uri: String,
        mint_price: u64
    ) acquires NFTCollectionV2 {
        let creator_addr = signer::address_of(creator);
        
        // Initialize collection if it doesn't exist
        if (!exists<NFTCollectionV2>(creator_addr)) {
            move_to(creator, NFTCollectionV2 { nfts: vector::empty(), counter: 0 });
        };
        
        let collection = borrow_global_mut<NFTCollectionV2>(creator_addr);
        collection.counter = collection.counter + 1;
        
        let nft = MemeNFTV2 {
            id: collection.counter,
            name,
            description,
            image_uri,
            creator: creator_addr,
            mint_price,
        };
        
        vector::push_back(&mut collection.nfts, nft);
    }

    /// Function to purchase and transfer a Meme NFT
    public entry fun purchase_meme_nft_v2(
        buyer: &signer, 
        nft_owner: address, 
        nft_id: u64
    ) acquires NFTCollectionV2 {
        let owner_collection = borrow_global_mut<NFTCollectionV2>(nft_owner);
        let buyer_addr = signer::address_of(buyer);
        
        // Find and remove the NFT from owner's collection
        let nft_index = 0;
        let found = false;
        let len = vector::length(&owner_collection.nfts);
        while (nft_index < len) {
            let nft_ref = vector::borrow(&owner_collection.nfts, nft_index);
            if (nft_ref.id == nft_id) {
                found = true;
                break
            };
            nft_index = nft_index + 1;
        };
        assert!(found, 2);
        
        let nft = vector::remove(&mut owner_collection.nfts, nft_index);
        
        // Transfer payment from buyer to original creator
        let payment = coin::withdraw<AptosCoin>(buyer, nft.mint_price);
        coin::deposit<AptosCoin>(nft.creator, payment);
        
        // Initialize buyer's collection if needed and add NFT
        if (!exists<NFTCollectionV2>(buyer_addr)) {
            move_to(buyer, NFTCollectionV2 { nfts: vector::empty(), counter: 0 });
        };
        let buyer_collection = borrow_global_mut<NFTCollectionV2>(buyer_addr);
        vector::push_back(&mut buyer_collection.nfts, nft);
    }

    #[view]
    public fun get_nft_details(owner: address, nft_id: u64): (String, String, String, address, u64) acquires NFTCollectionV2 {
        let collection = borrow_global<NFTCollectionV2>(owner);
        let len = vector::length(&collection.nfts);
        let i = 0;
        
        while (i < len) {
            let nft = vector::borrow(&collection.nfts, i);
            if (nft.id == nft_id) {
                return (nft.name, nft.description, nft.image_uri, nft.creator, nft.mint_price)
            };
            i = i + 1;
        };
        
        abort 1 // NFT not found
    }

    #[view] 
    public fun get_nft_count(owner: address): u64 acquires NFTCollectionV2 {
        if (!exists<NFTCollectionV2>(owner)) {
            return 0
        };
        
        let collection = borrow_global<NFTCollectionV2>(owner);
        vector::length(&collection.nfts)
    }
}
