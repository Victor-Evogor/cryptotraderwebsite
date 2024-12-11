

import { Navbar } from '@/components/Navbar';
import { TokenList } from '@/components/TokenList';
import { BottomBar } from '@/components/BottomBar';
import AirdropBanner from '@/components/AirdropBanner';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-200 via-purple-100 to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-200">
      <Navbar />
      <div className="mx-4 py-6">
      <AirdropBanner pnl={0.00}/>
      </div>
      <TokenList />
      <BottomBar/>
    </main>
  );
}
