"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, LinkIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { getTokenMetadata, getTokenPrice } from "@/lib/moralis-helpers";
import { formatPrice } from "@/utils/formatPrice";

interface TokenPair {
  chainId: string;
  dexId: string;
  url: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  liquidity: {
    usd: number;
  };
  fdv: number;
  marketCap: number;
  info?: {
    imageUrl?: string;
    websites?: { url: string }[];
    socials?: { platform: string; handle: string }[];
  };
  boosts?: {
    active: number;
  };
}



export default function TokenDetail({ params }: { params: { address: string } }) {
  const router = useRouter();
  const [tokenData, setTokenData] = useState<any>(null);
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [pairData, setPairData] = useState<TokenPair | null>(null);
  const [priceFormat, setPriceFormat] = useState<string | string[]>()

  const handleBuyEvent = () => {
    // TODO Implement this
  }

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Fetch token metadata and DexScreener data
        const [metadata, dexScreenerResponse] = await Promise.all([
          getTokenMetadata(params.address),
          fetch(`https://api.dexscreener.com/latest/dex/tokens/${params.address}`)
            .then(res => res.json())
        ]);

        setTokenData(metadata);
        
        if (dexScreenerResponse.pairs && dexScreenerResponse.pairs.length > 0) {
          setPairData(dexScreenerResponse.pairs[0]);
          setPrice(parseFloat(dexScreenerResponse.pairs[0].priceUsd));
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [params.address]);

  useEffect(()=>{
    setPriceFormat(formatPrice(price))
  }, [loading])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - 3/5 width */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://dd.dexscreener.com/ds-data/tokens/solana/${params.address}.png`}
                      className="w-10 h-10 rounded-full"
                      alt={tokenData?.name}
                    />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tokenData?.name || 'Unknown Token'}
                    </h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href={`https://solscan.io/token/${params.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Solscan
                    </a>
                    <a
                      href={`https://dexscreener.com/solana/${params.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
                    >
                      <LinkIcon className="w-4 h-4" />
                      DexScreener
                    </a>
                  </div>
                </div>
                
                <div className="mb-6">
                  <img 
                    src={`https://cdn.dexscreener.com/token-images/og/solana/${params.address}?timestamp=${Date.now()}`} 
                    className="w-full rounded-lg"
                    alt="Token header"
                  />
                </div>

                <div className="h-[600px]">
                  <iframe
                    src={`https://www.gmgn.cc/kline/sol/${params.address}`}
                    className="w-full h-full rounded-lg border border-gray-200 dark:border-gray-700"
                    title="Token Chart"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - 2/5 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Price Information
                </h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current Price</span>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {typeof priceFormat === "string"? priceFormat : (!priceFormat? "Loading price" : <span>0.0<sub>{priceFormat[0]}</sub>{priceFormat[1]}</span>)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Market Cap</span>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        ${pairData?.marketCap ? pairData.marketCap.toLocaleString() : 'N/A'}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Liquidity</span>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        ${pairData?.liquidity?.usd ? pairData.liquidity.usd.toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fully Diluted Value</span>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                      ${pairData?.fdv ? pairData.fdv.toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Activity Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Transaction Activity
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last 5 minutes</span>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        {10} transactions
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last 30 minutes</span>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        {10} transactions
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last 1 hour</span>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        {10} transactions
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                onClick={handleBuyEvent}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Buy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
