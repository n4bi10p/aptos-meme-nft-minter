module meme_nft::SimpleMemeNFT {

    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use std::string::String;

    /// Struct representing a simple Meme NFT
    struct MemeNFT has store, key {
        name: String,      // Name of the meme NFT
        creator: address,  // Address of the NFT creator
        mint_price: u64,   // Price to mint this NFT
    }

    /// Counter for tracking minted NFTs
    struct MintCounter has key {
        count: u64,
    }

    /// Function to create and mint a new Meme NFT
    public fun mint_meme_nft(
        creator: &signer, 
        name: String, 
        mint_price: u64
    ) {
        let creator_addr = signer::address_of(creator);
        
        // Initialize counter if needed
        if (!exists<MintCounter>(creator_addr)) {
            move_to(creator, MintCounter { count: 0 });
        };
        
        let nft = MemeNFT {
            name,
            creator: creator_addr,
            mint_price,
        };
        
        move_to(creator, nft);
    }

    /// Function to purchase and transfer a Meme NFT
    public fun purchase_meme_nft(
        buyer: &signer, 
        nft_owner: address
    ) acquires MemeNFT {
        let nft = move_from<MemeNFT>(nft_owner);
        
        // Transfer payment from buyer to creator
        let payment = coin::withdraw<AptosCoin>(buyer, nft.mint_price);
        coin::deposit<AptosCoin>(nft.creator, payment);
        
        // Transfer NFT to buyer
        move_to(buyer, nft);
    }
}
