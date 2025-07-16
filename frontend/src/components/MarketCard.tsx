'use client';

import React from 'react';
import Link from 'next/link';
import api from '../api';

interface Outcome {
  name: string;
  liquidity: number;
  odds: number;
}

interface MarketCardProps {
  market: {
    _id: string;
    title: string;
    description: string;
    outcomeType: string;
    outcomes: Outcome[];
    expiryDate: string;
    totalLiquidity: number;
  };
}

const MarketCard: React.FC<MarketCardProps> = ({ market }) => {
  const expiry = new Date(market.expiryDate).toLocaleString();

  const handleResolveMarket = async () => {
    try {
      await api.post(`/api/ctf-adapter/resolve/${market._id}`);
      alert('Market resolved successfully!');
    } catch (error: any) {
      alert(`Failed to resolve market: ${error.response?.data || error.message}`);
      console.error('Error resolving market:', error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <Link href={`/markets/${market._id}`} className="block">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{market.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{market.description}</p>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-500 text-xs">Expires:</p>
            <p className="text-sm font-medium text-gray-700">{expiry}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs text-right">Liquidity:</p>
            <p className="text-sm font-medium text-gray-700 text-right">${market.totalLiquidity.toFixed(2)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {market.outcomes.map((outcome) => (
            <div key={outcome.name} className="bg-gray-100 rounded-md p-3 text-center">
              <p className="text-sm font-medium text-gray-700">{outcome.name}</p>
              <p className="text-lg font-bold text-indigo-600">{(outcome.odds * 100).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      </Link>
      <button
        onClick={handleResolveMarket}
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Resolve Market
      </button>
    </div>
  );
};

export default MarketCard;
