'use client';

import React, { useState } from 'react';

const categories = ['All', 'Trending', 'Politics', 'Sports', 'Crypto', 'Tech', 'Culture', 'World', 'Economy'];

const CategoryFilter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Sports');

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
            ${selectedCategory === category
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
