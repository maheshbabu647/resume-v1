import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import { verifyEmail as apiVerifyEmail } from '@/api/authServiceApi';
import useAuthContext from '@/hooks/useAuth';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading, checkStatus } = useAuthContext();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'login_required'
  const [message, setMessage] = useState('Please wait while we verify your email address...');

  useEffect(() => {
    // Wait until the initial authentication check is complete
    if (isAuthLoading) {
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please check the link from your email.');
      return;
    }
    
    // If the user isn't logged in, prompt them to do so.
    if (!isAuthenticated) {
      setStatus('login_required');
      setMessage('Please log in to complete your email verification.');
      return;
    }

    const verify = async () => {
      setStatus('verifying');
      try {
        const response = await apiVerifyEmail(token);
        setStatus('success');
        setMessage(response.message);
        // FIX: Re-fetch the user status to update the context with isVerified: true
        await checkStatus(); 
        setTimeout(() => navigate('/dashboard'), 4000); // Redirect to dashboard after 4 seconds
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Email verification failed. The link may be invalid or expired.');
      }
    };

    verify();
  }, [token, isAuthenticated, isAuthLoading, navigate, checkStatus]);

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: location } });
  }

  return (
    <>
      <Helmet>
        <title>Email Verification | CareerForge</title>
      </Helmet>
      <main className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <Card className="bg-card shadow-xl rounded-xl">
            <CardHeader className="text-center p-8">
              <CardTitle className="text-3xl font-bold tracking-tight">Email Verification</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 text-center">
              {status === 'verifying' && (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">{message}</p>
                </div>
              )}
              {status === 'success' && (
                <Alert variant="default" className="bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              {status === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>Verification Error</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              {status === 'login_required' && (
                <Alert>
                  <LogIn className="h-5 w-5" />
                  <AlertTitle>Login Required</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
               <Button onClick={() => status === 'login_required' ? handleLoginRedirect() : navigate('/dashboard')} className="mt-8 w-full">
                {status === 'login_required' ? 'Go to Login' : 'Go to Dashboard'}
               </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </>
  );
};

export default VerifyEmailPage;
