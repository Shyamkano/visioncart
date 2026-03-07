 import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth(); // Get the user from our context

  // If there is no user, redirect to the /auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If there is a user, show the page they were trying to access
  return <Outlet />;
};

export default ProtectedRoute;