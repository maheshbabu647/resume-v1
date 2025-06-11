import React, { useState, useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthContext from '../hooks/useAuth.js';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const LoginForm = React.lazy(() => import('../components/Auth/LoginForm.jsx'));

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, signin, isLoading, error: authError, isAuthenticated } = useAuthContext();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (credentials) => {
    const user = await signin(credentials); // returns fresh userData
    console.log("Login returned user:", user);

    if (user) {
      if (from.includes('/verify-email/')) {
        navigate(from, { replace: true });
      }
      else if (!user.isVerified) {
        navigate('/verify-email', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  };


  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-foreground" aria-busy="true" aria-live="polite">
        <LoadingSpinner size="large" label="Redirecting..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login | CareerForge</title>
        <meta name="description" content="Login to your CareerForge account to access AI-powered resume building tools, manage your applications, and more." />
      </Helmet>

      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6 lg:p-8">
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
                className="mx-auto mb-4"
              >
                 <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text">
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
                  apiError={authError}
                />
              </Suspense>
              <div className="mt-4 text-center text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80 underline underline-offset-4">
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center p-6 sm:p-8 pt-2">
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-primary/80 underline underline-offset-4">
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </>
  );
};

export default LoginPage;
