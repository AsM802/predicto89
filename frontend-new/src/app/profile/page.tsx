'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
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
      <h1 className="text-4xl font-bold mb-6">Your Profile</h1>
      <p className="text-xl text-muted-foreground">Wallet Address: {user?.walletAddress}</p>
      {/* Additional profile details will go here */}
    </div>
  );
}
