'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMarkets } from "@/hooks/useMarkets";
import { MarketCard } from "@/components/MarketCard";
import { CategoryFilter } from "@/components/CategoryFilter";

export default function MarketsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: markets, isLoading, isError } = useMarkets(selectedCategory);

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  if (!token) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col items-center py-2">
      <h1 className="text-4xl font-bold mb-6">All Markets</h1>
      <div className="mb-8">
        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      </div>
      
      {isLoading && <p>Loading markets...</p>}
      {isError && <p>Error loading markets.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {markets?.map((market) => (
          <MarketCard key={market._id} market={market} />
        ))}
      </div>
    </div>
  );
}