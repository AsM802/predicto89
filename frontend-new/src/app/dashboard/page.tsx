'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  if (!token) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1 className="text-4xl font-bold mb-6">Your Dashboard</h1>
      <p className="text-xl text-muted-foreground">Welcome, {user?.walletAddress}. Here you can see your markets and bets.</p>
      {/* Dashboard content will go here */}
    </div>
  );
}
