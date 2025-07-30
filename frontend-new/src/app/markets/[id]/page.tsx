'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Market } from '@/hooks/useMarkets';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContract, useContractWrite, useContractRead } from '@thirdweb-dev/react';
import PredictionMarketABI from '@/lib/contracts/PredictionMarket.json';
import { useAuth } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ethers } from 'ethers';

  export default function MarketDetailPage() {
  const params = useParams();
  const marketId = params.id as string;
  const { token, user } = useAuth();

  const [betAmount, setBetAmount] = useState('');
  const [selectedOutcomeIndex, setSelectedOutcomeIndex] = useState<number | null>(null);
  const [resolveOutcomeIndex, setResolveOutcomeIndex] = useState<number | null>(null);

  const { data: market, isLoading: isMarketLoading, error: marketError } = useQuery<Market>({
    queryKey: ['market', marketId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/markets/${marketId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    enabled: !!marketId,
  });

  const { contract } = useContract(
    (market?.contractAddress && typeof market.contractAddress === 'string') ? {
      address: market.contractAddress,
      abi: PredictionMarketABI.abi,
    } : undefined
  );

  const { mutateAsync: placeBet, isLoading: isPlacingBet } = useContractWrite(
    contract ? {
      contract,
      functionName: "placeBet",
    } : null
  );
  const { mutateAsync: resolveMarket, isLoading: isResolvingMarket } = useContractWrite(
    contract ? {
      contract,
      functionName: "resolveMarket",
    } : null
  );
  const { mutateAsync: claimWinnings, isLoading: isClaimingWinnings } = useContractWrite(
    contract ? {
      contract,
      functionName: "claimWinnings",
    } : null
  );

  if (isMarketLoading) return <div className="text-center py-8">Loading market details...</div>;
  if (marketError) return <div className="text-center py-8 text-red-500">Error loading market: {marketError.message}</div>;
  if (!market) return <div className="text-center py-8">Market not found.</div>;

  const handlePlaceBet = async () => {
    if (!selectedOutcomeIndex || !betAmount || !market) {
      alert('Please select an outcome and enter a bet amount.');
      return;
    }
    try {
      await placeBet({
        args: [String(marketId), String(selectedOutcomeIndex)],
        overrides: {
          value: ethers.utils.parseEther(betAmount),
        },
      });
      alert('Bet placed successfully!');
      setBetAmount('');
      // Invalidate market query to refetch data
      // queryClient.invalidateQueries(['market', marketId]);
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet.');
    }
  };

  const handleResolveMarket = async () => {
    if (resolveOutcomeIndex === null || !market) {
      alert('Please select a winning outcome.');
      return;
    }
    try {
      await resolveMarket({ args: [String(marketId), String(resolveOutcomeIndex)] });
      alert('Market resolved successfully!');
      // Invalidate market query to refetch data
      // queryClient.invalidateQueries(['market', marketId]);
    } catch (error) {
      console.error('Error resolving market:', error);
      alert('Failed to resolve market.');
    }
  };

  const handleClaimWinnings = async () => {
    if (!market) return;
    try {
      await claimWinnings({ args: [String(marketId)] });
      alert('Winnings claimed successfully!');
      // Invalidate market query to refetch data
      // queryClient.invalidateQueries(['market', marketId]);
    } catch (error) {
      console.error('Error claiming winnings:', error);
      alert('Failed to claim winnings.');
    }
  };

  const endDate = new Date(market.endTimestamp).toLocaleString();
  const isMarketCreator = user?.walletAddress === market.creator; // Assuming market.creator is the wallet address

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{market.question}</CardTitle>
          <CardDescription>Category: {market.category}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Ends: {endDate}</p>
          <p className="mb-4">Status: {market.resolved ? `Resolved (Winning Outcome: ${market.outcomes[market.winningOutcomeIndex]})` : 'Open'}</p>

          <h3 className="text-lg font-semibold mb-2">Outcomes:</h3>
          <ul className="list-disc pl-5 mb-4">
            {(market.outcomes ?? []).map((outcome, index) => (
              <li key={index}>{outcome} (Total Bets: {market.outcomeAmounts[index] ? ethers.utils.formatEther(market.outcomeAmounts[index]) : '0'} ETH)</li>
            ))}
          </ul>

          {!market.resolved && (Date.now() / 1000 < Number(market.endTimestamp)) ? (
            <div className="mt-4 p-4 border rounded-md">
              <h4 className="text-md font-semibold mb-2">Place Your Bet</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="outcome-select">Select Outcome</Label>
                  <Select onValueChange={(value) => setSelectedOutcomeIndex(Number(value))}>
                    <SelectTrigger id="outcome-select">
                      <SelectValue placeholder="Select an outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      {(market.outcomes ?? []).map((outcome, index) => (
                        <SelectItem key={index} value={String(index)}>{outcome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bet-amount">Bet Amount (ETH)</Label>
                  <Input
                    id="bet-amount"
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="0.01"
                    step="0.001"
                  />
                </div>
              </div>
              <Button onClick={handlePlaceBet} disabled={isPlacingBet || !token} className="mt-4 w-full">
                {isPlacingBet ? 'Placing Bet...' : 'Place Bet'}
              </Button>
              {!token && <p className="text-sm text-red-500 mt-2">Please connect your wallet to place a bet.</p>}
            </div>
          ) : (
            <p className="mt-4 text-lg font-semibold">Market is closed for betting.</p>
          )}

          {market.resolved && (user?.walletAddress === market.creator) && (
            <div className="mt-4 p-4 border rounded-md bg-green-50">
              <h4 className="text-md font-semibold mb-2">Claim Winnings</h4>
              <Button onClick={handleClaimWinnings} disabled={isClaimingWinnings || !token} className="w-full">
                {isClaimingWinnings ? 'Claiming...' : 'Claim Winnings'}
              </Button>
            </div>
          )}

          {isMarketCreator && !market.resolved && (Date.now() / 1000 >= Number(market.endTimestamp)) && (
            <div className="mt-4 p-4 border rounded-md bg-yellow-50">
              <h4 className="text-md font-semibold mb-2">Resolve Market</h4>
              <Select onValueChange={(value) => setResolveOutcomeIndex(Number(value))}>
                <SelectTrigger id="resolve-outcome-select">
                  <SelectValue placeholder="Select winning outcome" />
                </SelectTrigger>
                <SelectContent>
                      {(market.outcomes ?? []).map((outcome, index) => (
                        <SelectItem key={index} value={String(index)}>{outcome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              <Button onClick={handleResolveMarket} disabled={isResolvingMarket || !token} className="mt-4 w-full">
                {isResolvingMarket ? 'Resolving...' : 'Resolve Market'}
              </Button>
            </div>
          )}

        </CardContent>
        <CardFooter>
          {/* Additional market actions or info */}
        </CardFooter>
      </Card>
    </div>
  );
}