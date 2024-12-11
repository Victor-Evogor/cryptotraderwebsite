interface RaydiumPriceResponse {
  id: string;
  success: boolean;
  data?: {
    [key: string]: string;
  };
  msg?: string;
}

export async function getRaydiumTokenPrices(tokenAddresses: string[]): Promise<{ [key: string]: string }> {
  try {
    const mintsParam = tokenAddresses.join(',');
    const response = await fetch(`https://api-v3.raydium.io/mint/price?mints=${mintsParam}`);
    const result: RaydiumPriceResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.msg || 'Failed to fetch token prices');
    }

    return result.data || {};
  } catch (error) {
    console.error('Error fetching Raydium token prices:', error);
    throw error;
  }
}

interface TokenDefinition {
  chainId: number;
  address: string;
  programId: string;
  logoURI: string;
  symbol: string;
  name: string;
  decimals: number;
  tags: string[];
  extensions: Record<string, unknown>;
}



export async function getRaydiumTokenMetadata(tokenAddresses: string[]): Promise<TokenDefinition[]> {
  try {
    const mintsParam = tokenAddresses.join(',');
    const response = await fetch(`https://api-v3.raydium.io/mint/ids?mints=${mintsParam}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.msg || 'Failed to fetch token metadata');
    }

    if(!result.data) throw new Error("GET "+`https://api-v3.raydium.io/mint/ids?mints?mints=${mintsParam}`+" returned {}")

    return result.data;
  } catch (error) {
    console.error('Error fetching Raydium token metadata:', error);
    throw error;
  }
}
