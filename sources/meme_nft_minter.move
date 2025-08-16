module meme_nft::MemeNFTMinter {

    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use std::string::String;
    use std::vector;

    /// Struct representing a Meme NFT
    struct MemeNFT has store, drop {
        id: u64,           // Unique identifier for the NFT
        name: String,      // Name of the meme NFT
        creator: address,  // Address of the NFT creator
        mint_price: u64,   // Price required to mint this NFT
    }

    /// Collection to hold multiple NFTs for an account
    struct NFTCollection has key {
        nfts: vector<MemeNFT>,
        counter: u64,
    }

    /// Function to create and mint a new Meme NFT
    public fun mint_meme_nft(
        creator: &signer, 
        name: String, 
        mint_price: u64
    ) acquires NFTCollection {
        let creator_addr = signer::address_of(creator);
        
        // Initialize collection if it doesn't exist
        if (!exists<NFTCollection>(creator_addr)) {
            move_to(creator, NFTCollection { nfts: vector::empty(), counter: 0 });
        };
        
        let collection = borrow_global_mut<NFTCollection>(creator_addr);
        collection.counter = collection.counter + 1;
        
        let nft = MemeNFT {
            id: collection.counter,
            name,
            creator: creator_addr,
            mint_price,
        };
        
        vector::push_back(&mut collection.nfts, nft);
    }

    /// Function to purchase and transfer a Meme NFT
    public fun purchase_meme_nft(
        buyer: &signer, 
        nft_owner: address, 
        nft_id: u64
    ) acquires NFTCollection {
        let owner_collection = borrow_global_mut<NFTCollection>(nft_owner);
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
        if (!exists<NFTCollection>(buyer_addr)) {
            move_to(buyer, NFTCollection { nfts: vector::empty(), counter: 0 });
        };
        let buyer_collection = borrow_global_mut<NFTCollection>(buyer_addr);
        vector::push_back(&mut buyer_collection.nfts, nft);
    }
}
