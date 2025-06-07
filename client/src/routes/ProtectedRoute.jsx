import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthContext from "../hooks/useAuth.js";
import LoadingSpinner from '../components/Common/LoadingSpinner/LoadingSpinner.jsx';

const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, isLoading, userData } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <LoadingSpinner size="large" label="Verifying access..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page.
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // If the user is authenticated but not verified, redirect them to the verification prompt page.
  // We don't need to check the path anymore because the verification page is now public.
  if (userData && !userData.isVerified) {
    return <Navigate to='/verification-required' replace />;
  }

  // If the route requires specific roles, check for them.
  if (roles && roles.length > 0) {
    const userRole = userData?.userRole;
    if (!userRole || !roles.includes(userRole)) {
      // If the user does not have the required role, redirect to the unauthorized page.
      return <Navigate to='/unauthorized' state={{ from: location }} replace />;
    }
  }

  // If all checks pass, render the protected content.
  return <Outlet />;
};

export default ProtectedRoute;
