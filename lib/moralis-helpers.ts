import Moralis from "moralis";
import axios from 'axios';

let isInitialized = false;

export async function initializeMoralis() {
  if (!isInitialized) {
    try {
      await Moralis.start({
        apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      });
      isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Moralis:", error);
    }
  }
}

export async function getTokenPrice(address: string): Promise<number> {
  try {
    await initializeMoralis();
    const response = await Moralis.SolApi.token.getTokenPrice({
      "network": "mainnet",
      "address": address
    });
    return response.raw.usdPrice || 0;
  } catch (error) {
    console.error("Error fetching token price:", error);
    return 0;
  }
}


interface TokenData {
  mint: string;
  standard: string;
  name: string;
  symbol: string;
  logo: string | null;
  decimals: string;
  metaplex: {
    metadataUri: string;
    masterEdition: boolean;
    isMutable: boolean;
    primarySaleHappened: number;
    sellerFeeBasisPoints: number;
    updateAuthority: string;
  };
}


export async function getTokenMetadata(address: string): Promise<TokenData | null> {
  if (!process.env.NEXT_PUBLIC_MORALIS_API_KEY) throw new Error("NEXT_PUBLIC_MORALIS_API_KEY environment varaible missing");
  try {
    const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/metadata`, {
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY
      }
    });
    return await response.json() as TokenData;
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    return null;
  }
}
