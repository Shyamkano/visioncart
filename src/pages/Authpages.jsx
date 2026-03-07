import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Make sure this path points to your supabaseClient.js
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // State for loading indicators and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Updated registerForm to match the database schema (full_name)
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/'); // On successful login, redirect to the home page
    }
    setLoading(false);
  };

  const handleRegisterSubmit = async () => {
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);

    // This is the critical part that connects to your database trigger.
    // The `full_name` key in `data` must match the key used in your SQL trigger.
    const { error } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,
      options: {
        data: {
          full_name: registerForm.fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Registration successful! Please check your email for a verification link.');
      setIsLogin(true); // Switch to the login tab for a better user experience
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* Background and other UI elements */}
      <div className="background"><div className="background-blur" /></div>

      <div className="auth-card-container">
        <div className="auth-card">
          {/* Header */}
          <div className="header">
            <div className="logo">
              <Sparkles size={32} style={{ color: '#fbbf24' }} />
              <span>VisionCart</span>
            </div>
            <h1>{isLogin ? 'Welcome Back' : 'Join VisionCart'}</h1>
            <p>{isLogin ? 'Step into your personalized vision experience' : 'Discover the future of eyewear technology'}</p>
          </div>

          {/* Tab Switcher */}
          <div className="tab-switcher">
            <button onClick={() => { setIsLogin(true); setError(null); }} className={`tab-button ${isLogin ? 'active' : ''}`}>
              <LogIn size={18} /> Sign In
            </button>
            <button onClick={() => { setIsLogin(false); setError(null); }} className={`tab-button ${!isLogin ? 'active' : ''}`}>
              <UserPlus size={18} /> Sign Up
            </button>
          </div>
          
          {/* Display Error Messages */}
          {error && <p className="error-message">{error}</p>}

          {/* Forms */}
          <div className="form-container">
            {isLogin ? (
              // Login Form
              <div>
                <div className="input-group">
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="input-field password-field"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button onClick={handleLoginSubmit} className="submit-button" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </div>
            ) : (
              // Registration Form
              <div>
                <div className="input-group">
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={registerForm.fullName}
                      onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="input-field password-field"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="input-group">
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      className="input-field password-field"
                    />
                    <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button onClick={handleRegisterSubmit} className="submit-button" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;