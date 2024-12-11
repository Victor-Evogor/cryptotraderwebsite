import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";

export async function getNumberOfTokenHolders(
  connection: Connection,
  tokenMintAddress: string
): Promise<number> {
  try {
    const mintPublicKey = new PublicKey(tokenMintAddress);

    // Fetch all accounts associated with the token mint
    const accounts = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        {
          dataSize: AccountLayout.span, // Filter by token account size
        },
        {
          memcmp: {
            offset: 0, // Offset to the mint address in token account data
            bytes: mintPublicKey.toBase58(),
          },
        },
      ],
    });

    // Count accounts with a non-zero token balance
    const holders = accounts.filter((account) => {
      const accountInfo = AccountLayout.decode(account.account.data);
      return accountInfo.amount > 0;
    });

    return holders.length;
  } catch (error) {
    console.error("Error fetching token holders:", error);
    throw error;
  }
}
