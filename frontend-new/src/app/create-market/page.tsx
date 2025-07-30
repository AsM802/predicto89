'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateMarketPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('Sports');
  const [marketEndTimestamp, setMarketEndTimestamp] = useState('');
  const [bettingEndTimestamp, setBettingEndTimestamp] = useState('');
  const [outcomes, setOutcomes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  if (!token) {
    return null; // Or a loading spinner
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/markets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          question,
          category,
          endTimestamp: Math.floor(new Date(marketEndTimestamp).getTime() / 1000), // Market End Date as Unix timestamp in seconds
          bettingEndTimestamp: Math.floor(new Date(bettingEndTimestamp).getTime() / 1000), // Betting End Date as Unix timestamp in seconds
          outcomes: outcomes.split(',').map(o => o.trim()),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Market created successfully!');
        setQuestion('');
        setCategory('Sports');
        setMarketEndTimestamp('');
        setBettingEndTimestamp('');
        setOutcomes('');
        // Optionally redirect to the new market or markets page
        router.push('/markets');
      } else {
        setError(data.message || 'Failed to create market.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Sports", "Politics", "Technology", "Finance", "Other"];

  return (
    <div className="flex flex-col items-center py-2">
      <h1 className="text-4xl font-bold mb-6">Create New Market</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
        Fill out the form below to create a new prediction market.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-card p-8 rounded-lg shadow-md">
        <div>
          <Label htmlFor="question">Market Question</Label>
          <Input
            id="question"
            type="text"
            placeholder="e.g., Will BTC reach $100k by 2025?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bettingEndTimestamp">Betting End Date</Label>
          <Input
            id="bettingEndTimestamp"
            type="datetime-local"
            value={bettingEndTimestamp}
            onChange={(e) => setBettingEndTimestamp(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="marketEndTimestamp">Market End Date</Label>
          <Input
            id="marketEndTimestamp"
            type="datetime-local"
            value={marketEndTimestamp}
            onChange={(e) => setMarketEndTimestamp(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="outcomes">Outcomes (comma-separated)</Label>
          <Input
            id="outcomes"
            type="text"
            placeholder="e.g., Yes, No, Maybe"
            value={outcomes}
            onChange={(e) => setOutcomes(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Create Market'}
        </Button>
      </form>
    </div>
  );
}
