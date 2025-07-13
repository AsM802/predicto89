'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import MarketCard from '../../components/MarketCard';
import CategoryFilter from '../../components/CategoryFilter';
import api from '../../api';

interface Market {
  _id: string;
  title: string;
  description: string;
  outcomeType: string;
  outcomes: Array<{ name: string; liquidity: number; odds: number }>;
  expiryDate: string;
  totalLiquidity: number;
}

export default function DashboardPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await api.get('/api/markets');
        setMarkets(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch markets');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          Loading markets...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center text-red-500">
          Error: {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Active Markets</h1>
        <CategoryFilter />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">No active markets found.</p>
          ) : (
            markets.map((market) => (
              <MarketCard key={market._id} market={market} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}