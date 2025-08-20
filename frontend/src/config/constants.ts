// Network and contract configuration
export const NETWORK = "devnet";
export const APTOS_RPC_URL = "https://api.devnet.aptoslabs.com/v1";
export const CONTRACT_ADDRESS = "0x26198839dbbf26dcd13e1ea47702e9dc7a08604486033d6ac513cee981309ea9";
export const MODULE_NAME = "MemeNFTMinter";

// Function identifiers  
export const MINT_FUNCTION = `${CONTRACT_ADDRESS}::${MODULE_NAME}::mint_meme_nft`;
export const PURCHASE_FUNCTION = `${CONTRACT_ADDRESS}::${MODULE_NAME}::purchase_meme_nft`;
export const DELETE_FUNCTION = `${CONTRACT_ADDRESS}::${MODULE_NAME}::delete_meme_nft`;
