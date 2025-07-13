'use client';

import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface Bet {
  _id: string;
  marketId: {
    _id: string;
    title: string;
    description: string;
    outcomeType: string;
  };
  outcome: string;
  amount: number;
  timestamp: string;
}

const Profile: React.FC = () => {
  const { user, token } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBets = async () => {
      if (!token) {
        setLoading(false);
        setError('Not authenticated');
        return;
      }
      try {
        const response = await api.get('/api/bets/me');
        setBets(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch bets');
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, [token]);

  if (loading) {
    return <div className="text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">User Profile</h2>
      <div className="mb-8">
        <p className="text-lg"><strong>Email:</strong> {user.email}</p>
        <p className="text-lg"><strong>Wallet Balance:</strong> {user.walletBalance}</p>
      </div>

      <h3 className="text-2xl font-bold mb-4">My Bets</h3>
      {bets.length === 0 ? (
        <p className="text-gray-600">You haven't placed any bets yet.</p>
      ) : (
        <div className="space-y-4">
          {bets.map((bet) => (
            <div key={bet._id} className="border p-4 rounded-md shadow-sm">
              <p><strong>Market:</strong> {bet.marketId.title}</p>
              <p><strong>Bet on:</strong> {bet.outcome}</p>
              <p><strong>Amount:</strong> {bet.amount}</p>
              <p><strong>Date:</strong> {new Date(bet.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
