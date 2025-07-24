'use client';

import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { ClientProviders } from "./ClientProviders";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function ThirdwebProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      clientId="5aa2c67a20c2e2c7225a03a6ba79811a"
      activeChain={Sepolia}
    >
      <ClientProviders>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ClientProviders>
    </ThirdwebProvider>
  );
}