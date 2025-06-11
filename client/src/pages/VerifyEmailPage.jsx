import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle, Send, KeyRound } from 'lucide-react';
import { verifyEmail as apiVerifyEmail, resendVerification as apiResendVerification } from '@/api/authServiceApi';
import useAuthContext from '@/hooks/useAuth';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, isAuthenticated, checkStatus } = useAuthContext();
  
  const [formData, setFormData] = useState({
    userEmail: location.state?.userEmail || userData?.userEmail || '',
    verificationCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' }); // type: 'success' or 'error'

  // If a logged-in and already verified user lands here, send them to the dashboard.
  useEffect(() => {
    console.log("hello verify email")
    if (isAuthenticated && userData?.isVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, userData, navigate]);
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    // Only allow numeric input for the verification code and limit to 6 digits
    if (id === 'verificationCode' && (!/^\d*$/.test(value) || value.length > 6)) {
      return;
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.verificationCode.length !== 6) {
        setFeedback({ message: 'Verification code must be exactly 6 digits.', type: 'error' });
        return;
    }
    setIsLoading(true);
    setFeedback({ message: '', type: '' });

    try {
      const response = await apiVerifyEmail(formData.userEmail, formData.verificationCode);
      setFeedback({ message: response.message || 'Email successfully verified!', type: 'success' });
      await checkStatus(); // Re-fetch user status to update the context (isVerified: true)
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 3000);

    } catch (error) {
      setFeedback({ message: error.message || 'Verification failed. The code may be invalid or expired.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResend = async () => {
    if (!formData.userEmail) {
        setFeedback({ message: 'Email address is missing. Cannot resend code.', type: 'error' });
        return;
    }
    setIsResending(true);
    setFeedback({ message: '', type: '' });

    try {
        const response = await apiResendVerification({ userEmail: formData.userEmail });
        setFeedback({ message: response.message, type: 'success' });
    } catch (error) {
        setFeedback({ message: error.message || 'Failed to resend code. Please try again later.', type: 'error' });
    } finally {
        setIsResending(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Email Verification | CareerForge</title>
        <meta name="description" content="Enter your 6-digit verification code to activate your CareerForge account." />
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <KeyRound className="h-10 w-10" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">Verify Your Email</CardTitle>
              <CardDescription className="pt-2">
                We've sent a 6-digit code to <strong>{formData.userEmail || 'your email'}</strong>. Please enter it below.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="userEmail">Email Address</Label>
                    <Input
                        id="userEmail"
                        type="email"
                        value={formData.userEmail}
                        disabled 
                        className="cursor-not-allowed"
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    placeholder="_ _ _ _ _ _"
                    required
                    maxLength="6"
                    className="text-center text-lg tracking-[0.5em]"
                  />
                </div>

                {feedback.message && (
                  <Alert variant={feedback.type === 'error' ? 'destructive' : 'default'} className={feedback.type === 'success' ? 'bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-300 [&>svg]:text-green-500' : ''}>
                    {feedback.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{feedback.type === 'success' ? 'Success!' : 'Error'}</AlertTitle>
                    <AlertDescription>{feedback.message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading || isResending}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Verify Account
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">Didn't receive the code?</p>
                <Button variant="link" onClick={handleResend} disabled={isLoading || isResending} className="p-1 h-auto">
                   {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   Resend Code
                </Button>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </main>
    </>
  );
};

export default VerifyEmailPage;