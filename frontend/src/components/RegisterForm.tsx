
"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';

interface RegisterFormProps {
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onClose }) => {
  const { connect, signup } = useAuth();

  const handleConnect = async () => {
    try {
      await connect();
      await signup();
      onClose(); // Close modal on successful connection
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Sign Up
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Connect your wallet to sign up for Predicto89.
        </p>
        <button
          onClick={handleConnect}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Connect Wallet & Sign Up
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
