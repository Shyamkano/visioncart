import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ShoppingCart, Sparkle, EyeIcon, Calendar, Settings, HelpCircle, LogOut, Menu, X, Home, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-close menu on route change as a foolproof fallback
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav className="navbar">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }} onClick={closeMenu}>
          <h1 className="logo">VisionCart</h1>
        </Link>

        {/* Hamburger is now primarily for secondary items on mobile */}
        <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {/* Main links (visible on desktop) */}
          <Link to="/shop" className={`nav-link desktop-only-link ${isActive('/shop')}`} onClick={closeMenu}> <ShoppingCart size={16} /> Shop</Link>
          <Link to="/ai-frames" className={`nav-link desktop-only-link ${isActive('/ai-frames')}`} onClick={closeMenu}> <Sparkle size={15} /> AI Frames</Link>
          <Link to="/cart" className={`nav-link desktop-only-link ${isActive('/cart')}`} onClick={closeMenu}><ShoppingCart size={16} /> Cart</Link>
          <Link to="/profile" className={`nav-link desktop-only-link ${isActive('/profile')}`} onClick={closeMenu}> <User size={15} /> Profile</Link>

          {/* Secondary links (visible in hamburger or desktop) */}
          <Link to="/vision-health" className={`nav-link ${isActive('/vision-health')}`} onClick={closeMenu}> <EyeIcon size={15} /> Eye Care</Link>
          <Link to="/appointments" className={`nav-link ${isActive('/appointments')}`} onClick={closeMenu}> <Calendar size={15} /> Appointments</Link>

          {profile?.is_admin && (
            <Link to="/admin" className={`nav-link ${isActive('/admin')}`} onClick={closeMenu}> <Settings size={15} /> Admin</Link>
          )}

          <Link to="/support" className={`nav-link ${isActive('/support')}`} onClick={closeMenu}> <HelpCircle size={15} /> Support</Link>

          {/* Mobile-only user actions that appear inside the hamburger menu */}
          {user && (
            <div className="mobile-user-actions">
              <div className="nav-link" style={{ color: '#9ca3af', borderBottom: '1px solid #374151', paddingBottom: '16px', marginBottom: '8px', cursor: 'default' }}>
                Logged in as: {profile?.full_name || user.email}
              </div>
              <button onClick={() => { handleLogout(); closeMenu(); }} className="logout-btn mobile-logout-btn" style={{ width: '100%', justifyContent: 'center' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>

        {user && (
          <div className="user-nav-actions">
            <span className="welcome-message">Hi, {profile?.full_name || user.email}  </span>
            <button onClick={handleLogout} className="login-btn logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <Link to="/" className={`bottom-nav-link ${isActive('/')}`} onClick={closeMenu}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link to="/shop" className={`bottom-nav-link ${isActive('/shop')}`} onClick={closeMenu}>
          <ShoppingCart size={20} />
          <span>Shop</span>
        </Link>
        <Link to="/ai-frames" className={`bottom-nav-link ${isActive('/ai-frames')}`} onClick={closeMenu}>
          <Sparkle size={20} />
          <span>AI</span>
        </Link>
        <Link to="/cart" className={`bottom-nav-link ${isActive('/cart')}`} onClick={closeMenu}>
          <ShoppingCart size={20} />
          <span>Cart</span>
        </Link>
        <Link to="/profile" className={`bottom-nav-link ${isActive('/profile')}`} onClick={closeMenu}>
          <User size={20} />
          <span>Profile</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
