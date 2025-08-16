#[test_only]
module meme_nft::MemeNFTMinterTests {
    use meme_nft::MemeNFTMinter;
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::aptos_coin;
    use std::string;

    #[test(creator = @0x123, buyer = @0x456, aptos_framework = @0x1)]
    public fun test_mint_and_purchase_meme_nft(
        creator: signer, 
        buyer: signer, 
        aptos_framework: signer
    ) {
        // Initialize the coin for testing
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(&aptos_framework);
        
        // Mint some coins for the buyer
        coin::register<AptosCoin>(&buyer);
        coin::register<AptosCoin>(&creator);
        let coins = coin::mint<AptosCoin>(1000, &mint_cap);
        coin::deposit<AptosCoin>(signer::address_of(&buyer), coins);

        // Test minting a meme NFT
        let nft_name = string::utf8(b"Doge Meme");
        let mint_price = 100;
        
        MemeNFTMinter::mint_meme_nft(&creator, nft_name, mint_price);

        // Test purchasing the meme NFT (using NFT ID 1 for the first minted NFT)
        let creator_addr = signer::address_of(&creator);
        MemeNFTMinter::purchase_meme_nft(&buyer, creator_addr, 1);

        // Verify the creator received payment
        let creator_balance = coin::balance<AptosCoin>(creator_addr);
        assert!(creator_balance == mint_price, 1);

        // Clean up
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(creator = @0x123)]
    public fun test_mint_multiple_nfts(creator: signer) {
        // Test minting multiple NFTs to ensure counter works
        let nft1_name = string::utf8(b"Pepe Meme");
        let nft2_name = string::utf8(b"Wojak Meme");
        
        MemeNFTMinter::mint_meme_nft(&creator, nft1_name, 50);
        MemeNFTMinter::mint_meme_nft(&creator, nft2_name, 75);
        
        // If we reach here without error, the test passes
        // (Multiple NFTs were minted successfully with unique IDs)
    }

    #[test(creator = @0x123, buyer = @0x456, aptos_framework = @0x1)]
    #[expected_failure(abort_code = 2)]
    public fun test_invalid_nft_id_fails(
        creator: signer, 
        buyer: signer, 
        aptos_framework: signer
    ) {
        // Initialize the coin for testing
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(&aptos_framework);
        
        // Mint insufficient coins for the buyer
        coin::register<AptosCoin>(&buyer);
        coin::register<AptosCoin>(&creator);
        let coins = coin::mint<AptosCoin>(50, &mint_cap); // Only 50 coins
        coin::deposit<AptosCoin>(signer::address_of(&buyer), coins);

        // Mint an NFT with higher price
        let nft_name = string::utf8(b"Expensive Meme");
        let mint_price = 100; // Price is 100 but buyer only has 50
        
        MemeNFTMinter::mint_meme_nft(&creator, nft_name, mint_price);

        // This should fail due to NFT not found (using invalid ID)
        let creator_addr = signer::address_of(&creator);
        MemeNFTMinter::purchase_meme_nft(&buyer, creator_addr, 999); // Invalid NFT ID

        // Clean up (won't be reached due to expected failure)
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}
