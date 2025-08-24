
import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the search term back to parent
    onSearch(query.trim().toLowerCase());
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // Live search (optional: filters as you type)
            onSearch(e.target.value.trim().toLowerCase());
          }}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm leading-5 bg-white placeholder-gray-500 
                     focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search files..."
        />
      </div>
    </form>
  );
}
