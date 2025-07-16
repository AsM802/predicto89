'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "../components/QueryProvider";
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Mumbai } from "@thirdweb-dev/chains";
import ThirdwebWrapper from "../components/ThirdwebWrapper"; // We will create this file

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ThirdwebProvider
            activeChain={Mumbai}
            clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
          >
            <ThirdwebWrapper>
              {children}
            </ThirdwebWrapper>
          </ThirdwebProvider>
        </QueryProvider>
      </body>
    </html>
  );
}