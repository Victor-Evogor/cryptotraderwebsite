import { Connection, PublicKey } from "@solana/web3.js";

// Utility function to convert seconds into a human-readable format
function convertSecondsToReadableTime(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours`;
  const days = Math.floor(hours / 24);
  return `${days} days`;
}

// Function to get the age of a token
export async function getTokenAge(
  connection: Connection,
  tokenMintAddress: string
): Promise<string> {
  try {
    const mintPublicKey = new PublicKey(tokenMintAddress);

    // Fetch the transaction history for the mint address
    const signatures = await connection.getSignaturesForAddress(mintPublicKey, {
      limit: 1, // Get the oldest transaction
    });

    if (signatures.length === 0) {
      throw new Error("No transaction history found for this token");
    }

    // Fetch the block time of the oldest transaction
    const oldestTransaction = signatures[0];
    const blockTime = await connection.getBlockTime(oldestTransaction.slot);

    if (!blockTime) {
      throw new Error("Unable to fetch block time for the oldest transaction");
    }

    // Calculate the age in seconds
    const currentTime = Math.floor(Date.now() / 1000);
    const ageInSeconds = currentTime - blockTime;

    // Convert to a readable format
    return convertSecondsToReadableTime(ageInSeconds);
  } catch (error) {
    console.error("Error fetching token age:", error);
    throw error;
  }
}
