import React from 'react';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground p-4 mt-8 text-center">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Predicto89. All rights reserved.</p>
      </div>
    </footer>
  );
}
