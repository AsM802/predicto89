import { useQuery } from '@tanstack/react-query';

export interface Market {
  _id: string;
  question: string;
  category: string;
  endTimestamp: string;
  outcomes: string[];
  resolved: boolean;
  winningOutcomeIndex: number;
  outcomeAmounts: Record<string, number>;
  contractAddress?: string;
  creator?: string;
  // Add other market properties as needed
}

export const useMarkets = (category?: string) => {
  return useQuery<Market[]>({ 
    queryKey: ['markets', category],
    queryFn: async () => {
      const url = category && category !== 'all' ? `${process.env.NEXT_PUBLIC_API_URL}/markets?category=${category}` : `${process.env.NEXT_PUBLIC_API_URL}/markets`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};
