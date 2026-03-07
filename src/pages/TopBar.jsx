import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LogOut } from 'lucide-react';
import './TopBar.css';

const TopBar = () => {
  // We get profile and user, which might be null initially
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="top-bar">
      <div className="top-bar-content">
        {user ? (
          <div className="user-info">
            <Link to="/profile" className="user-greeting">
              {/* This is now 100% safe. If profile is null, it will show the email. */}
              Hi, {profile?.full_name || user?.email}
            </Link>
            <button onClick={handleLogout} className="top-bar-logout-btn">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="user-info">
            <Link to="/auth" className="top-bar-login-btn">
              Login / Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;