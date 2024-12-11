import { Connection, PublicKey } from "@solana/web3.js";

export async function getTotalTransactions(
  connection: Connection,
  tokenMintAddress: string
): Promise<number> {
  try {
    const mintPublicKey = new PublicKey(tokenMintAddress);

    // Fetch all confirmed signatures for the token mint address
    const signatures = await connection.getSignaturesForAddress(mintPublicKey);

    // The total number of transactions corresponds to the length of the signatures array
    return signatures.length;
  } catch (error) {
    console.error("Error fetching total transactions:", error);
    throw error;
  }
}
