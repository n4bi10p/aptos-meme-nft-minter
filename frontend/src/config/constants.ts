// Network and contract configuration
export const NETWORK = "devnet";
export const APTOS_RPC_URL = "https://api.devnet.aptoslabs.com/v1";
export const CONTRACT_ADDRESS = "0x64f6979360f13452cd87d367490075326f8e73d21a8bc746695f8d15e12e2016";
export const MODULE_NAME = "MemeNFTMinter";

// Function identifiers  
export const MINT_FUNCTION = `${CONTRACT_ADDRESS}::${MODULE_NAME}::mint_meme_nft`;
export const PURCHASE_FUNCTION = `${CONTRACT_ADDRESS}::${MODULE_NAME}::purchase_meme_nft`;
