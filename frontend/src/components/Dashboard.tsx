"use client";

import React from 'react';
import { useMarkets } from '../hooks/useMarkets';

const Dashboard: React.FC = () => {
  const { data: markets, isLoading, isError, error } = useMarkets();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Loading markets...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-600">Error loading markets: {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Active Markets</h1>
      {markets && markets.length === 0 ? (
        <p className="text-gray-700">No active markets found. Be the first to create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets?.map((market) => (
            <div key={market._id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">{market.title}</h3>
              <p className="text-gray-600 mb-4">{market.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
                <span>Expiry: {new Date(market.expiryDate).toLocaleDateString()}</span>
                <span>Liquidity: {market.totalLiquidity}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold mb-4">
                {market.outcomes.map((outcome) => (
                  <span key={outcome.name}>{outcome.name}: {outcome.odds}</span>
                ))}
              </div>
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full">
                View Market
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;