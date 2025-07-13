"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  setShowLoginModal: (show: boolean) => void;
  setShowRegisterModal: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setShowLoginModal, setShowRegisterModal }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/markets" className="flex items-center space-x-2">
            <span className="text-3xl font-extrabold">P</span>
            <span className="text-2xl font-bold">Preficto89</span>
          </Link>
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search markets..."
              className="w-full px-4 py-2 pl-10 rounded-full bg-indigo-700 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-200 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
        <nav>
          <ul className="flex space-x-4 items-center">
            {user ? (
              <>
                <li>
                  <Link href="/dashboard" className="hover:text-indigo-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/create-market" className="hover:text-indigo-200">
                    Create Market
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-indigo-200">
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-indigo-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-indigo-600 transition-colors duration-200"
                  >
                    Log In
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="px-4 py-2 bg-white text-indigo-600 rounded-md shadow-md hover:bg-indigo-100 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
