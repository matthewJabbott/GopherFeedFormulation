import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@clerk/clerk-react';
import { useUserRole } from '../utils/UserRole';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { role, loading } = useUserRole();
  const location = useLocation();

  if (!isLoaded || loading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn || !userId) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorised" replace />;
  }

  return children;
};

export default ProtectedRoute; 