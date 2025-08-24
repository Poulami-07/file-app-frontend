import React, { useState, useEffect } from 'react';
import FileList from './FileList';
import SearchBar from './SearchBar';
import "../App.css"
export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
      </div>
      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} />
      </div>
      <FileList searchQuery={searchQuery} />
    </div>
  );
}