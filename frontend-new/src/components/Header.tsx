'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEffect, useCallback, useState } from 'react';

export function Header() {
  const { token, login, logout } = useAuth();
  const { address, isConnected } = useAccount();
  const { connectAsync, isConnecting, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);

  const handleWalletConnect = useCallback(async () => {
    if (isWalletConnecting) return; // Prevent multiple concurrent calls
    setIsWalletConnecting(true);
    try {
      console.log("Attempting wallet connection...");
      const connection = await connectAsync({ connector: injected() });
      
      if (!connection || !connection.accounts || connection.accounts.length === 0) {
        throw new Error("Wallet connection failed or no accounts found.");
      }
      console.log("Wallet connected:", connection.accounts[0]);

      const walletAddress = connection.accounts[0];
      const message = `Sign in to Predicto89 with wallet ${walletAddress}`;
      
      console.log("Attempting to sign message...");
      const signature = await signMessageAsync({ message });
      console.log("Message signed.");

      console.log("Sending authentication request to backend...");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, signature }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Authentication successful.");
        login(data.token, { id: data._id, walletAddress: data.walletAddress });
      } else {
        console.error('Authentication failed:', data.error || data.message);
        disconnect();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if ('code' in error && error.code === -32002) {
          console.error('Wallet connection error: A connection request is already pending in your wallet. Please open your wallet extension and approve or reject the pending request.');
        } else {
          console.error('Wallet connection or authentication error:', error.message);
        }
      } else {
        console.error('An unknown error occurred:', error);
      }
    } finally {
      setIsWalletConnecting(false);
    }
  }, [connectAsync, signMessageAsync, login, disconnect, isWalletConnecting]);

  const handleLogout = () => {
    disconnect();
    logout();
  };

  useEffect(() => {
    // Removed automatic wallet connection on page load to prevent persistent MetaMask pending request issues.
    // User will now need to manually click 'Connect Wallet'.
  }, [isConnected, address, token, handleWalletConnect, isConnecting, pendingConnector, isWalletConnecting]);

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">Predicto89</Link>
        </h1>
        <nav className="flex items-center space-x-4">
          {token ? (
            <>
              <Link href="/markets" className="hover:underline">Markets</Link>
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/create-market" className="hover:underline">Create Market</Link>
              <Link href="/profile" className="hover:underline">Profile</Link>
              <Button onClick={handleLogout} variant="secondary">Logout</Button>
            </>
          ) : (
            <Button onClick={handleWalletConnect}>Connect Wallet</Button>
          )}
        </nav>
      </div>
    </header>
  );
}