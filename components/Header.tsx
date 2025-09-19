
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-amber-700 font-cinzel">
              QUEEN
            </span>
            <span className="ml-3 text-sm text-stone-500 hidden sm:block">
              Your AI Storytelling Partner
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
