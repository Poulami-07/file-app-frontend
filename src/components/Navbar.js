
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Upload, Folder, Users, LogOut, Trash2 } from 'lucide-react';
import "../App.css";

export default function Navbar({ session }) {
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Get user initial (first character of email, uppercase)
  const userInitial = session?.user?.email ? session.user.email.charAt(0).toUpperCase() : "U";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            FileManager
          </Link>
          <div className="navbar-links">
            <Link
              to="/"
              className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Folder size={18} />
              <span>My Files</span>
            </Link>
            <Link
              to="/upload"
              className={`navbar-link ${location.pathname === '/upload' ? 'active' : ''}`}
            >
              <Upload size={18} />
              <span>Upload</span>
            </Link>
            <Link
              to="/shared"
              className={`navbar-link ${location.pathname === '/shared' ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Shared</span>
            </Link>

            
            <Link
            to="/recycle-bin"
            className={`navbar-link ${location.pathname === '/recycle-bin' ? 'active' : ''}`}
            >
            <Trash2 size={18} />
            <span>Recycle Bin</span>
            </Link>

          </div>
        </div>

        <div className="navbar-right">
          {/* Rounded Initial */}
          <div className="user-avatar">
            {userInitial}
          </div>
          <button
            onClick={handleSignOut}
            className="signout-btn"
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
