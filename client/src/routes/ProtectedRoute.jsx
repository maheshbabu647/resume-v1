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
        <p className="mt-4 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // If the route requires specific roles, check the user's role.
  if (roles && roles.length > 0) {
    const userRole = userData?.userRole;
    if (!userRole || !roles.includes(userRole)) {
      // User is authenticated but does not have the required role.
      console.warn(
        `Access Denied: User role "${userRole}" is not in required roles (${roles.join(', ')}) for ${location.pathname}`
      );
      // *** FIX: Redirect to a dedicated unauthorized page instead of dashboard ***
      return <Navigate to='/unauthorized' state={{ from: location }} replace />;
    }
  }

  // If authenticated and (no roles are required OR user has the required role), render the child routes.
  return <Outlet />;
};

export default ProtectedRoute;
