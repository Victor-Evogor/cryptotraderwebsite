"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tab } from "@headlessui/react";
import { classNames } from "@/lib/utils";
import { FaGlobe, FaTelegram, FaTwitter } from "react-icons/fa";
import {
  getRaydiumTokenMetadata,
  getRaydiumTokenPrices,
} from "@/lib/raydium-helpers";
import { formatPrice } from "@/utils/formatPrice";
import { getNumberOfTokenHolders } from "@/utils/getNumberOfTokenHolders";
import { Connection } from "@solana/web3.js";
import { getTotalSupply } from "@/utils/getTotalSupply";
import { getTokenAge } from "@/utils/getAgeOfToken";
import { getTotalTransactions } from "@/utils/getTokenTxns";

interface Token {
  id: string;
  name: string;
  image: string;
  age: string;
  liquidity: number;
  marketCap: number;
  holders: number;
  transactions: number;
  price: string | string[];
  tokenAddress: string;
  links: {
    website?: string;
    telegram?: string;
    twitter?: string;
  };
}

export function TokenList() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const categories = ["Age", "Price", "Txns", "Holders"];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  useEffect(() => {
    const fetchTokenPrices = async () => {
      setIsLoading(true);
      setError(null);

      interface TokenInfo {
        url: string;
        chainId: string;
        tokenAddress: string;
        icon: string;
        header: string;
        openGraph: string;
        description: string;
        links?: Link[];
      }

      interface Link {
        label?: string;
        type?: string;
        url: string;
      }

      const data: TokenInfo[] = (
        await (
          await fetch("https://api.dexscreener.com/token-profiles/latest/v1")
        ).json()
      ).filter((tokenData: TokenInfo) => tokenData.chainId === "solana");
      console.log("Latest tokens from dexscreener: ", data)

      let metadata = await getRaydiumTokenMetadata(
        data.map((token) => token.tokenAddress)
      );
      const prices = await getRaydiumTokenPrices(
        data.map((token) => token.tokenAddress)
      );
      metadata = metadata.filter((token) => !!token);
      // console.log("Meta data gotten from raydium rest api == ", metadata);
      // console.log("Data gotten from dexscreener == ", data);

      if (!process.env.NEXT_PUBLIC_RPC_ENDPOINT) throw new Error("Missing environment variable NEXT_PUBLIC_RPC_ENDPOINT")
      const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT);


      const tokenDetails: {
        holders: number,
        marketCap: number,
        age: string,
        txns: number
      }[] = await Promise.all(data.map(token => token.tokenAddress).map(async address => {
        return {
          holders: await getNumberOfTokenHolders(connection, address),
          marketCap: (await getTotalSupply(connection, address)) * Number(prices[address]),
          age: await getTokenAge(connection, address) ,
          txns: await getTotalTransactions(connection, address)
        }
      }))


      const tokens: Token[] = data.map((token, index) => {
        let links = {}
        if (token.links)
        links = {
          website: token.links.find(link => link.label?.toLowerCase() === 'website')?.url,
          telegram: token.links.find(link => link.label?.toLowerCase() === 'telegram')?.url,
          twitter: token.links.find(link => link.label?.toLowerCase() === 'twitter')?.url,
        };

        const details = tokenDetails[index]
        
        return {
          id: "" + (index + 1),
          age: details.age,
          image: token.icon,
          name: metadata.find(
            (tokenMetadata) => tokenMetadata.address === token.tokenAddress
          )?.name as string,
          liquidity: 0,
          holders: details.holders,
          marketCap: details.marketCap,
          price: formatPrice(+prices[token.tokenAddress]),
          transactions: details.txns,
          tokenAddress: token.tokenAddress,
          links,
        };
      });

      return tokens;
    };

    fetchTokenPrices()
      .then(setTokens)
      .catch((err) => {
        console.error("Error fetching token data:", err);
        setError("Failed to load token data");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="w-full px-4 mt-2">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-white dark:bg-purple-900/20 p-1 max-w-md border border-purple-200 dark:border-transparent">
          {categories.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-purple-500 text-white shadow"
                    : "dark:text-gray-300 hover:bg-purple-800/30 hover:text-white text-purple-900"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {categories.map((category, idx) => (
            <Tab.Panel
              key={idx}
              className="rounded-xl bg-white dark:bg-purple-900/10 p-3 border border-purple-200 dark:border-transparent"
            >
              <div className="overflow-x-auto overflow-y-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-purple-100 dark:bg-purple-900/30">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-purple-900 dark:text-white sm:pl-6"
                          >
                            Token
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-purple-900 dark:text-white"
                          >
                            Age
                          </th>
                         
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-purple-900 dark:text-white"
                          >
                            Market Cap
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-purple-900 dark:text-white"
                          >
                            Holders
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-purple-900 dark:text-white"
                          >
                            Txns
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-purple-900 dark:text-white"
                          >
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-200 dark:divide-gray-700 bg-white dark:bg-purple-900/20">
                        {isLoading ? (
                          <tr>
                            <td colSpan={7} className="text-center py-4">
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                <span className="ml-2 text-purple-500">
                                  Loading tokens...
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : error ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-center py-4 text-red-500"
                            >
                              {error}
                            </td>
                          </tr>
                        ) : tokens.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-center py-4 text-gray-500 dark:text-gray-400"
                            >
                              No tokens found
                            </td>
                          </tr>
                        ) : (
                          tokens.map((token) => (
                            <tr
                              key={token.id}
                              className="hover:bg-purple-800/30 cursor-pointer"
                              onClick={() => router.push(`/token/${token.tokenAddress}`)}
                            >
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={token.image}
                                      alt={token.name}
                                      width={40}
                                      height={40}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="flex items-center gap-2">
                                      <div className="font-medium dark:text-white text-gray-800">
                                        {token.name}
                                      </div>
                                      <div className="flex gap-1">
                                        {token.links.website && (
                                          <a
                                            href={token.links.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-gray-500 hover:text-purple-500 transition-colors"
                                          >
                                            <FaGlobe size={14} />
                                          </a>
                                        )}
                                        {token.links.telegram && (
                                          <a
                                            href={token.links.telegram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-gray-500 hover:text-purple-500 transition-colors"
                                          >
                                            <FaTelegram size={14} />
                                          </a>
                                        )}
                                        {token.links.twitter && (
                                          <a
                                            href={token.links.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-gray-500 hover:text-purple-500 transition-colors"
                                          >
                                            <FaTwitter size={14} />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300 text-gray-800">
                                {token.age}
                              </td>
                              
                              <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300 text-gray-800">
                                {formatNumber(token.marketCap)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300 text-gray-800">
                                {token.holders.toLocaleString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300 text-gray-800">
                                {token.transactions.toLocaleString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300 text-gray-800">
                                {typeof token.price === "string" ? (
                                  token.price
                                ) : !token.price ? (
                                  "Loading price"
                                ) : (
                                  <span>
                                    0.0<sub>{token.price[0]}</sub>
                                    {token.price[1].slice(0, 2)}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
