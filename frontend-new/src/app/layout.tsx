import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Predicto89",
  description: "Decentralized Prediction Market",
};

import { ThirdwebProviderWrapper } from "@/components/ThirdwebProviderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ThirdwebProviderWrapper>
          {children}
        </ThirdwebProviderWrapper>
      </body>
    </html>
  );
}



import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";