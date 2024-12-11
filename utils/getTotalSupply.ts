import { Connection, PublicKey } from "@solana/web3.js";
import { MintLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function getTotalSupply(
  connection: Connection,
  tokenMintAddress: string
): Promise<number> {
  try {
    const mintPublicKey = new PublicKey(tokenMintAddress);

    // Fetch the mint account data
    const mintAccountInfo = await connection.getAccountInfo(mintPublicKey);
    if (!mintAccountInfo) {
      throw new Error("Mint account not found");
    }

    // Decode the mint account data
    const mintData = MintLayout.decode(mintAccountInfo.data);

    
    // Extract the supply (in raw token units)
    const rawSupply = mintData.supply;
    const decimals = mintData.decimals;
    const humanReadableSupply = Number(rawSupply) / Math.pow(10, decimals);

    // Return the total supply as a number
    return humanReadableSupply;
  } catch (error) {
    console.error("Error fetching total supply:", error);
    throw error;
  }
}
