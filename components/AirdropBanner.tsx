"use client";

interface AirdropBannerProps {
  pnl: number;
}

export default function AirdropBanner({ pnl }: AirdropBannerProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            🎉 Upcoming Airdrop Alert! 
          </h2>
          <p className="text-white/90 mb-2">
            Get ready for our exclusive airdrop! Your PnL points will determine your allocation.
            <br/>The more profits you make, the more PnL points you get
          </p>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 rounded-full px-4 py-1 text-white text-sm">
              Your PnL Points: {Math.abs(pnl).toFixed(2)}
            </span>
            <span className="bg-white/20 rounded-full px-4 py-1 text-white text-sm">
              Airdrop Status: Coming Soon
            </span>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-6xl">🪂</span>
        </div>
      </div>
    </div>
  );
}
