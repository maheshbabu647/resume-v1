import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, KeyRound } from 'lucide-react';

import useAuthContext from '@/hooks/useAuth.js';
import { verifyEmail as apiVerifyEmail, resendVerification as apiResendVerification } from '@/api/authServiceApi';

const LoginForm = React.lazy(() => import('./LoginForm.jsx'));
const SignupForm = React.lazy(() => import('./SignupForm.jsx'));

const VerificationView = ({ userEmail, onVerify, onResend, isLoading, isResending, feedback }) => {
  const [verificationCode, setVerificationCode] = useState('');
  useEffect(() => {
    // Automatically trigger resend when this view appears for an unverified login
    if (userEmail) {
        onResend();
    }
  }, [userEmail, onResend]);

  const handleCodeChange = (e) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value) || value.length > 6) return;
    setVerificationCode(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(verificationCode);
  };
  return (
    <>
      <DialogHeader>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <KeyRound className="h-8 w-8" />
        </div>
        <DialogTitle className="text-2xl text-center">Verify Your Email</DialogTitle>
        <DialogDescription className="text-center">
          We've sent a new 6-digit code to <strong>{userEmail}</strong>.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input id="verificationCode" value={verificationCode} onChange={handleCodeChange} placeholder="_ _ _ _ _ _" required maxLength="6" className="text-center text-lg tracking-[0.5em]" />
            </div>
            {feedback.message && (
              <Alert variant={feedback.type === 'error' ? 'destructive' : 'default'} className={feedback.type === 'success' ? 'bg-green-500/10' : ''}>
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading || isResending}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Verify & Continue
            </Button>
          </form>
      </div>
    </>
  );
};

const AuthDialog = ({ open, onOpenChange, initialView = 'login' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signin, signup, error: authError, clearAuthError, checkStatus, isAuthenticated, userData } = useAuthContext();
  const [localView, setLocalView] = useState(initialView);
  const [emailForSignup, setEmailForSignup] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // --- THIS IS THE CORE OF THE FINAL FIX ---
  // We derive the view based on the single source of truth: the auth context.
  let currentView = localView;
  if (isAuthenticated && userData && !userData.isVerified) {
    // If the user is logged in but not verified, we MUST show the verify form.
    // This overrides any local state.
    currentView = 'verify';
  }
  // --- END OF FIX ---

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setLocalView(initialView);
        setEmailForSignup('');
        setFeedback({ message: '', type: '' });
        if(authError) clearAuthError();
      }, 300);
    } else {
        setLocalView(initialView);
    }
  }, [open, initialView, authError, clearAuthError]);

  const handleLogin = async (credentials) => {
    setIsSubmitting(true);
    await signin(credentials);
    onOpenChange(false); 
    setIsSubmitting(false);
  };

  const handleSignup = async (credentials) => {
    setIsSubmitting(true);
    clearAuthError();
    const success = await signup(credentials);
    if (success) {
      setEmailForSignup(credentials.userEmail);
      setLocalView('verify');
    }
    setIsSubmitting(false);
  };
  
  const handleTabChange = (newView) => {
    if(localView !== newView){
        if(authError) clearAuthError();
        setLocalView(newView);
    }
  }

  const handleVerify = async (verificationCode) => {
    if (verificationCode.length !== 6) {
      setFeedback({ message: 'Code must be 6 digits.', type: 'error' });
      return;
    }
    setIsVerifying(true);
    setFeedback({ message: '', type: '' });
    const emailToVerify = userData?.userEmail || emailForSignup;
    try {
      await apiVerifyEmail(emailToVerify, verificationCode);
      await checkStatus(); 
      onOpenChange(false);// Re-check status. The context will update, and the dialog will close.
    } catch (error) {
      setFeedback({ message: error.message || 'Verification failed.', type: 'error' });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResend = useCallback(async () => {
    setIsResending(true);
    setFeedback({ message: '', type: '' });
    const emailToResend = userData?.userEmail || emailForSignup;
    try {
      const response = await apiResendVerification({ userEmail: emailToResend });
      setFeedback({ message: response.message, type: 'success' });
    } catch (error) {
      setFeedback({ message: error.message || 'Failed to resend.', type: 'error' });
    } finally {
      setIsResending(false);
    }
  }, [userData, emailForSignup]);

  return (
    <Dialog open={!!open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Suspense fallback={<div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          {currentView === 'verify' ? (
            <VerificationView
              userEmail={userData?.userEmail || emailForSignup}
              onVerify={handleVerify}
              onResend={handleResend}
              isLoading={isVerifying}
              isResending={isResending}
              feedback={feedback}
            />
          ) : (
            <Tabs value={localView} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="pt-6">
                 <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
                    <DialogDescription className="text-center">Log in to continue your work.</DialogDescription>
                </DialogHeader>
                <LoginForm onSubmit={handleLogin} isLoading={isSubmitting} apiError={authError} />
              </TabsContent>
              <TabsContent value="signup" className="pt-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold text-center">Create Your Account</DialogTitle>
                    <DialogDescription className="text-center">Sign up to save your work and get started.</DialogDescription>
                </DialogHeader>
                <SignupForm onSubmit={handleSignup} isLoading={isSubmitting} apiError={authError} />
              </TabsContent>
            </Tabs>
          )}
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;