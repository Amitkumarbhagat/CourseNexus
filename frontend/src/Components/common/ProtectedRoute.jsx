import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../api/auth.service';

const ProtectedRoute = ({ children, requiredRole }) => {
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required (like ADMIN) and user doesn't have it, redirect to home
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, show the component
  return children;
};

export default ProtectedRoute;
