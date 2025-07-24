import { Market } from "@/hooks/useMarkets";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const endDate = new Date(market.endTimestamp).toLocaleDateString();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{market.question}</CardTitle>
        <CardDescription>Category: {market.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p>Ends: {endDate}</p>
        <div className="mt-2">
          <h4 className="font-semibold">Outcomes:</h4>
          {market.outcomes && market.outcomes.length > 0 ? (
            <ul>
              {market.outcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          ) : (
            <p>No outcomes defined.</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/markets/${market._id}`} className="w-full">
          <Button className="w-full">View Market</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
