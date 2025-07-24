'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { MarketCard } from "@/components/MarketCard";
import { useMarkets } from "@/hooks/useMarkets";



 

export default function Home() {
  const { token, user } = useAuth();
  const { data: markets, isLoading: isMarketsLoading, error: marketsError } = useMarkets();

  

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] py-2">
      <h1 className="text-4xl font-bold mb-6">Welcome to Predicto89</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
        Your decentralized platform for predicting future events.
      </p>

      {!token ? (
        <Button size="lg" className="mb-12">
          Connect Wallet
        </Button>
      ) : (
        <p className="text-lg mb-12">Welcome back, {user?.walletAddress}!</p>
      )}

      <section className="w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">Current Markets</h2>
        {isMarketsLoading ? (
          <p className="text-center">Loading markets...</p>
        ) : marketsError ? (
          <p className="text-center text-red-500">Error loading markets: {marketsError.message}</p>
        ) : markets && markets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map((market) => (
              <MarketCard key={market._id} market={market} />
            ))}
          </div>
        ) : (
          <p className="text-center">No markets available.</p>
        )}
      </section>

      
    </div>
  );
}
