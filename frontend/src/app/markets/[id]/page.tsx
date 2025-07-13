'use client';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'next/navigation';
import Layout from '../../../components/Layout';
import api from '../../../api';
import { useAuth } from '../../../context/AuthContext';

interface Outcome {
  name: string;
  liquidity: number;
  odds: number;
}

interface Market {
  _id: string;
  title: string;
  description: string;
  outcomeType: string;
  outcomes: Outcome[];
  expiryDate: string;
  totalLiquidity: number;
  totalVolume: number;
  resolved: boolean;
  resolvedOutcome: string | null;
}

const MarketDetailPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [betAmount, setBetAmount] = useState<number>(0);
  const [betMessage, setBetMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const response = await api.get(`/api/markets/${id}`);
        setMarket(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch market details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMarket();

      const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001');

      socket.on('connect', () => {
        console.log('Connected to Socket.IO');
        socket.emit('joinMarket', id);
      });

      socket.on('marketUpdate', (updatedMarket) => {
        console.log('Market updated via Socket.IO', updatedMarket);
        setMarket(updatedMarket);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO');
      });

      return () => {
        socket.emit('leaveMarket', id);
        socket.disconnect();
      };
    }
  }, [id]);

  const handlePlaceBet = async (e: React.FormEvent) => {
    e.preventDefault();
    setBetMessage(null);
    if (!user) {
      setBetMessage('Please log in to place a bet.');
      return;
    }
    if (!selectedOutcome) {
      setBetMessage('Please select an outcome.');
      return;
    }
    if (betAmount <= 0) {
      setBetMessage('Bet amount must be positive.');
      return;
    }

    console.log('Placing bet: Token from localStorage before API call:', localStorage.getItem('token'));

    try {
      await api.post('/api/bets', {
        marketId: id,
        outcome: selectedOutcome,
        amount: betAmount,
      });
      setBetMessage('Bet placed successfully!');
      // Optionally refresh market data to show updated odds/liquidity
      const response = await api.get(`/api/markets/${id}`);
      setMarket(response.data);
    } catch (err: any) {
      setBetMessage(err.response?.data?.message || 'Failed to place bet.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          Loading market details...
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

  if (!market) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          Market not found.
        </div>
      </Layout>
    );
  }

  const expiry = new Date(market.expiryDate).toLocaleString();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{market.title}</h1>
          <p className="text-gray-700 mb-4">{market.description}</p>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-500 text-sm">Expires:</p>
              <p className="text-base font-medium text-gray-700">{expiry}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm text-right">Total Liquidity:</p>
              <p className="text-base font-medium text-gray-700 text-right">${market.totalLiquidity.toFixed(2)}</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3">Outcomes & Odds:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {market.outcomes.map((outcome) => (
              <div
                key={outcome.name}
                className={`p-4 border rounded-md cursor-pointer transition-colors duration-200
                  ${selectedOutcome === outcome.name ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:bg-gray-50'}`}
                onClick={() => setSelectedOutcome(outcome.name)}
              >
                <p className="text-lg font-medium text-gray-800">{outcome.name}</p>
                <p className="text-2xl font-bold text-indigo-600">{(outcome.odds * 100).toFixed(0)}%</p>
                <p className="text-sm text-gray-500">Liquidity: ${outcome.liquidity.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {!market.resolved && new Date() < new Date(market.expiryDate) ? (
            <form onSubmit={handlePlaceBet} className="space-y-4">
              <h3 className="text-xl font-semibold mb-3">Place Your Bet:</h3>
              <div>
                <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700">Bet Amount</label>
                <input
                  type="number"
                  id="betAmount"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseFloat(e.target.value))}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Place Bet
              </button>
              {betMessage && <p className="mt-4 text-center text-sm text-gray-600">{betMessage}</p>}
            </form>
          ) : (
            <div className="mt-6 p-4 bg-gray-100 rounded-md text-center">
              {market.resolved ? (
                <p className="text-lg font-semibold text-green-600">Market Resolved: {market.resolvedOutcome}</p>
              ) : (
                <p className="text-lg font-semibold text-red-600">Market Expired</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MarketDetailPage;
