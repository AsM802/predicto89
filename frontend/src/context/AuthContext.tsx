'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThirdwebProvider, useAddress, useMetamask } from '@thirdweb-dev/react';
import { Mumbai } from "@thirdweb-dev/chains";

interface User {
  // Define your user properties here
  // For example:
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  address: string | undefined;
  connect: () => Promise<any>;
  disconnect: () => Promise<any>;
  login: () => Promise<void>;
  signup: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const address = useAddress();
  const connect = useMetamask();

  console.log("AuthContext: Initializing. Address:", address, "User:", user);

  const login = async () => {
    if (address) {
      const userData: User = { id: address, name: 'Logged In User', email: '' };
      setUser(userData);
      console.log("AuthContext: User logged in:", userData);
    }
  };

  const signup = async () => {
    if (address) {
      const newUser: User = { id: address, name: 'New Signed Up User', email: '' };
      setUser(newUser);
      console.log("AuthContext: User signed up:", newUser);
    }
  };

  const logout = () => {
    setUser(null);
    console.log("AuthContext: User logged out.");
  };

  const disconnect = async () => {
    console.log("AuthContext: Disconnect function called.");
    // Thirdweb's useMetamask doesn't directly provide a disconnect function.
    // Wallet disconnection is typically handled by the user from their wallet extension.
    // For a more complete solution, you might need to manage connection state manually.
    console.log("AuthContext: Disconnected.");
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, address, connect, disconnect, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ThirdwebAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThirdwebProvider
      activeChain={Mumbai}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThirdwebProvider>
  );
};