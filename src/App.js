import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import SharedFiles from './components/SharedFiles';
import Navbar from './components/Navbar';
import RecycleBin from "./components/RecycleBin";
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        {!session ? (
          <Auth />
        ) : (
          <>
            <Navbar session={session} />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/upload" element={<FileUpload />} />
                <Route path="/shared" element={<SharedFiles />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/recycle-bin" element={<RecycleBin />} />
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;