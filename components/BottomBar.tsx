"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SOL } from '@/constants';
import { getRaydiumTokenPrices } from '@/lib/raydium-helpers';

export function BottomBar() {
  const [solPrice, setSolPrice] = useState<string | number>('0.00');

  useEffect(() => {
    getRaydiumTokenPrices([SOL]).then((value) => {
      setSolPrice(Number(value[SOL]).toFixed(2))
    })
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-purple-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button className="flex items-center">
              <span className="text-purple-900 dark:text-purple-100">Refer</span>
              <span className="ml-1" role="img" aria-label="gift">🎁</span>
            </button>
            <Link href="/guide" className="text-purple-900 dark:text-purple-100 hover:text-purple-700 dark:hover:text-purple-300">
              Learn More
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="text-purple-900 dark:text-purple-100 hover:text-purple-700 dark:hover:text-purple-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://t.me/yourchannel" target="_blank" rel="noopener noreferrer" className="text-purple-900 dark:text-purple-100 hover:text-purple-700 dark:hover:text-purple-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.98 1.26-5.61 3.71-.53.36-1.01.54-1.44.53-.47-.01-1.38-.26-2.05-.48-.83-.27-1.49-.42-1.43-.89.03-.25.35-.51.96-.78 3.78-1.64 6.3-2.73 7.57-3.27 3.6-1.53 4.36-1.8 4.85-1.81.11 0 .35.03.51.14.13.1.17.23.19.38.02.15.01.35-.01.49z"/>
              </svg>
            </a>
            <div className="text-purple-900 dark:text-purple-100">
              SOL: ${solPrice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
