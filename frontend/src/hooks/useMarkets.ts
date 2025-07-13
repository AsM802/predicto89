import { useQuery } from '@tanstack/react-query';
import api from '../api';

interface Outcome {
  name: string;
  liquidity: number;
  odds: number;
}

interface Market {
  _id: string;
  title: string;
  description: string;
  outcomeType: 'YES_NO' | 'MULTIPLE_CHOICE' | 'NUMERIC_RANGE';
  outcomes: Outcome[];
  expiryDate: string;
  creator: string; // This will be a User ID
  resolved: boolean;
  resolvedOutcome: string | null;
  totalLiquidity: number;
  totalVolume: number;
  createdAt: string;
}

const fetchMarkets = async (): Promise<Market[]> => {
  const { data } = await api.get('/api/markets');
  return data;
};

export const useMarkets = () => {
  return useQuery<Market[], Error>({
    queryKey: ['markets'],
    queryFn: fetchMarkets,
  });
};
