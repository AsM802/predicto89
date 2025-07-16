'use client';

import React, { ReactNode } from 'react';
import { useAddress, useMetamask } from '@thirdweb-dev/react';
import { AuthProvider } from '../context/AuthContext';

interface ThirdwebWrapperProps {
  children: ReactNode;
}

const ThirdwebWrapper: React.FC<ThirdwebWrapperProps> = ({ children }) => {
  const address = useAddress();
  const connect = useMetamask();

  return (
    <AuthProvider address={address} connect={connect}>
      {children}
    </AuthProvider>
  );
};

export default ThirdwebWrapper;
