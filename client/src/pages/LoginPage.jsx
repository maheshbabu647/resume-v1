import React, { useState, useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthContext from '../hooks/useAuth.js';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button'; // For potential future use e.g. social logins

// Lazy load LoginForm
const LoginForm = React.lazy(() => import('../components/Auth/LoginForm.jsx'));

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signin, isLoading, error: authError, isAuthenticated } = useAuthContext(); // Renamed error to authError for clarity

  // pageError is primarily for errors not directly handled by LoginForm's apiError prop
  const [pageError, setPageError] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Update pageError if authError from context changes
  useEffect(() => {
    if (authError) {
      setPageError(authError.message || 'An authentication error occurred.');
    } else {
      setPageError(null);
    }
  }, [authError]);

  const handleLogin = async (credentials) => {
    setPageError(null); // Clear previous page-level errors
    const success = await signin(credentials);
    if (success) {
      navigate(from, { replace: true });
    }
    // If signin fails, authError in context will be updated, and the effect above will set pageError.
    // LoginForm also receives authError directly via apiError prop for inline display.
  };

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-foreground" aria-busy="true" aria-live="polite">
        <LoadingSpinner size="large" label="Redirecting..." />
        <p className="mt-4">Redirecting...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login | CareerForge</title>
        <meta name="description" content="Login to your CareerForge account to access AI-powered resume building tools, manage your applications, and more." />
        <meta property="og:title" content="Login | CareerForge" />
        <meta property="og:description" content="Access your CareerForge dashboard to build and manage your professional resumes." />
        {/* Add other relevant OG/Twitter tags */}
      </Helmet>

      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6 lg:p-8" aria-label="Login Page Main Content">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="bg-card text-card-foreground shadow-2xl rounded-xl">
            <CardHeader className="text-center p-6 sm:p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                className="mx-auto mb-4 text-primary" // CareerForge logo/icon can go here
              >
                 {/* Placeholder for a logo, e.g., an icon or text */}
                 <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-brand via-brand-light to-brand-dark text-transparent bg-clip-text">
                    CareerForge
                 </Link>
              </motion.div>
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome Back!</CardTitle>
              <CardDescription className="text-muted-foreground pt-1">
                Sign in to continue to your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 pt-0">
              <Suspense fallback={
                <div className="flex justify-center items-center h-40">
                  <LoadingSpinner label="Loading form..." />
                </div>
              }>
                <LoginForm
                  onSubmit={handleLogin}
                  isLoading={isLoading}
                  apiError={authError} // Pass the error object from context directly
                />
              </Suspense>
            </CardContent>
            <CardFooter className="flex flex-col items-center p-6 sm:p-8 pt-2">
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-primary/80 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
                  Sign Up
                </Link>
              </p>
              {/* Optional: Add forgot password link later */}
              {/* <p className="mt-2 text-center text-xs text-muted-foreground">
                <Link to="/forgot-password" className="hover:text-primary/80 underline underline-offset-4">
                  Forgot password?
                </Link>
              </p> */}
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </>
  );
};

export default LoginPage;
