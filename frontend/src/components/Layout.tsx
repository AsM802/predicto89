'use client';

import React, { useState } from 'react';
import Header from './Header';
import AuthForm from './AuthForm';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header setShowLoginModal={setShowLoginModal} setShowRegisterModal={setShowRegisterModal} />
      <main className="flex-grow py-8">
        {children}
      </main>

      {(showLoginModal || showRegisterModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 bg-white w-96 mx-auto rounded-lg shadow-lg">
            <button
              onClick={closeModals}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <AuthForm
              isLogin={showLoginModal}
              onClose={closeModals}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
