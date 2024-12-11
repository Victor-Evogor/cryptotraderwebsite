"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getAuthToken } from "@/lib/auth-helpers";
import ThemeToggle from "@/components/ThemeToggle";
import AirdropBanner from "@/components/AirdropBanner";
import { getTokenMetadata, getTokenPrice } from "@/lib/moralis-helpers";
import { getRaydiumTokenPrices } from "@/lib/raydium-helpers";

export default function WalletDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pnl, setPnl] = useState(0);
  const [tokenData, setTokenData] = useState<{[key: string]: {
    name: string;
    symbol: string;
    price: number;
  }}>({});

  useEffect(() => {
    const fetchTokenData = async (coins: any[]) => {
      const tokenDataMap: {[key: string]: any} = {};
      const coinPrices = await getRaydiumTokenPrices(coins.map(coin => {
        return coin.address
      }))
      
      for (let i =0; i < coins.length; i++) {
        const coin = coins[i]
          try {
            const metadata = await getTokenMetadata(coin.address);
            const price = coinPrices[i][coin.address]
            tokenDataMap[coin.address] = {
              name: metadata?.name || 'Unknown',
              symbol: metadata?.symbol || '',
              price: price || 0
            };
          } catch (error) {
            console.error("Error fetching token data:", error);
            tokenDataMap[coin.address] = {
              name: 'Unknown',
              symbol: '',
              price: 0
            };
          }
        
      }
      setTokenData(tokenDataMap);
    };

    const fetchWalletData = async () => {
      const authToken = await getAuthToken();
      try {
        const response = await fetch(`/api/wallets/${params.id}`, {
          // method: "POST",
          headers: {
            Authorization: "Bearer " + authToken,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch wallet data");
        }
        const data = await response.json();
        console.log("Data gotten from api == ", data);
        setWalletData(data.wallet);
        await fetchTokenData(data.wallet.coins);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [params.id, router]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="toaster">
          {/* Toast container will be rendered here */}
        </div>
        <ThemeToggle />
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </button>

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : walletData ? (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {walletData.name}
              </h1>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex justify-between">
                <div className="flex items-center space-x-6">
                <div>
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.1"
                      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      className="fill-[#323232] dark:fill-gray-200"
                    />
                    <path
                      d="M14.5 9C14.5 9 13.7609 8 11.9999 8C8.49998 8 8.49998 12 11.9999 12C15.4999 12 15.5 16 12 16C10.5 16 9.5 15 9.5 15"
                      className="stroke-[#323232] dark:stroke-gray-200"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 7V17"
                      className="stroke-[#323232] dark:stroke-gray-200"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      className="stroke-[#323232] dark:stroke-gray-200"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {`${params.id.slice(0, 4)}...${params.id.slice(-4)}`}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(params.id);
                        toast((t) => (
                          <div className="flex flex-col gap-2 roboto-medium">
                            <span className="font-medium">✅ Wallet address copied to clipboard!</span>
                            <span className="text-yellow-500 text-sm font-normal">
                              ⚠️ Warning: Only transfers from another virtual wallet will work. 
                              Real on-chain transfers will result in loss of tokens.
                            </span>
                          </div>
                        ), {
                          duration: 4000,
                          style: {
                            background: '#333',
                            color: '#fff',
                          },
                        });
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  <span className={`${
                    pnl > 0 ? 'text-green-500' : 
                    pnl < 0 ? 'text-red-500' : 
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {pnl > 0 ? '+' : ''}{pnl}% PnL
                  </span>
                </div>
                </div>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg 
                  font-medium transition-all duration-200 transform hover:scale-105 
                  active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  <span>Add more funds</span>
                  <span role="img" aria-label="cash">💸</span>
                </button>
              </div>

              <AirdropBanner pnl={pnl} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Portfolio Performance
                    </h2>
                  </div>
                  <div className="h-[200px] w-full">
                    <SparkLineChart
                      data={[4, 3.5, 5, 4.9, 6.1, 5.7, 6, 5.8, 7.1, 6.8]}
                      height={200}
                      
                    />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Assets
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {walletData.coins.map((coin: any, index: number) => (
                            <tr key={index} className="hover:bg-purple-100/60 dark:hover:bg-purple-900/20 transition-colors duration-150 cursor-pointer">
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {tokenData[coin.address]?.name}
                                {tokenData[coin.address]?.symbol && ` (${tokenData[coin.address].symbol})`}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                ${(tokenData[coin.address]?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                {coin.amount.toLocaleString()}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                ${((tokenData[coin.address]?.price || 0) * coin.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400">
              Wallet not found
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
