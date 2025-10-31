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
import GoogleLoginButton from './GoogleLoginButton.jsx';
import LinkedInLoginButton from './LinkedInLoginButton.jsx';

const LoginForm = React.lazy(() => import('./LoginForm.jsx'));
const SignupForm = React.lazy(() => import('./SignupForm.jsx'));

// --- CHANGE 1: Remove the side-effect from the child component ---
// The VerificationView is now simpler and only handles user input.
const VerificationView = ({ userEmail, onVerify, onResendClick, isLoading, isResending, feedback }) => {
  const [verificationCode, setVerificationCode] = useState('');

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
          We've sent a 6-digit code to <strong>{userEmail}</strong>. Please enter it below.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode">Verification Code</Label>
            <Input
              id="verificationCode"
              value={verificationCode}
              onChange={handleCodeChange}
              placeholder="_ _ _ _ _ _"
              required
              maxLength="6"
              className="text-center text-lg tracking-[0.5em]"
              autoComplete="one-time-code"
            />
          </div>
          {feedback.message && (
            <Alert
              variant={feedback.type === 'error' ? 'destructive' : 'default'}
              className={feedback.type === 'success' ? 'bg-green-500/10' : ''}
            >
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading || isResending || verificationCode.length !== 6}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verify & Continue
          </Button>
        </form>
         <div className="mt-4 text-center text-sm">
          <p className="text-muted-foreground">Didn't receive the code?</p>
            <Button variant="link" onClick={onResendClick} disabled={isLoading || isResending} className="p-1 h-auto">
               {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Resend Code
            </Button>
        </div>
      </div>
    </>
  );
};


const AuthDialog = ({ open, onOpenChange, initialView = 'login', onSuccess, onSaveFormData = null }) => {
  const { signin, signup, error: authError, clearAuthError, checkStatus, userData } = useAuthContext();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localView, setLocalView] = useState(initialView);
  const [emailForVerification, setEmailForVerification] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setLocalView(initialView);
        setEmailForVerification('');
        setFeedback({ message: '', type: '' });
        clearAuthError();
      }, 300);
    }
  }, [open, initialView, clearAuthError]);
  
  // --- CHANGE 2: Create a robust, reusable function to send the code ---
  const sendVerificationCode = useCallback(async (email) => {
    if (!email) return;
    setIsResending(true);
    setFeedback({ message: '', type: '' });
    try {
      const response = await apiResendVerification({ userEmail: email });
      setFeedback({ message: response.message, type: 'success' });
    } catch (error) {
      setFeedback({ message: error?.message || 'Failed to send code.', type: 'error' });
    } finally {
      setIsResending(false);
    }
  }, []);


  const handleLogin = async (credentials) => {
    setIsSubmitting(true);
    clearAuthError();
    try {
      const loginData = await signin(credentials);
      if (!loginData) return; // signin failed, error is in context

      if (loginData.isVerified) {
        if (onSuccess) await onSuccess();
        onOpenChange(false);
      } else {
        // --- CHANGE 3: The unverified login flow is now explicit ---
        const email = loginData.userEmail || credentials.userEmail;
        setEmailForVerification(email);
        setLocalView('verify');
        await sendVerificationCode(email); // Send the code
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (credentials) => {
    setIsSubmitting(true);
    clearAuthError();
    try {
      const success = await signup(credentials);
      if (!success) return; // signup failed, error is in context

      // --- CHANGE 4: The successful signup flow is now explicit ---
      setEmailForVerification(credentials.userEmail);
      setLocalView('verify');
      // The code is already sent from the backend on signup, so no need to call sendVerificationCode here.
      setFeedback({ message: "We've sent a verification code to your email.", type: 'success' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (newView) => {
    if (localView !== newView) {
      clearAuthError();
      setLocalView(newView);
    }
  };

  const handleVerify = async (verificationCode) => {
    if (verificationCode.length !== 6) {
      setFeedback({ message: 'Code must be 6 digits.', type: 'error' });
      return;
    }
    setIsVerifying(true);
    setFeedback({ message: '', type: '' });
    try {
      await apiVerifyEmail(emailForVerification, verificationCode);
      await checkStatus();
      setFeedback({ message: 'Verification successful! You can now continue.', type: 'success' });
      if (onSuccess) await onSuccess();
      setTimeout(() => onOpenChange(false), 1500);
    } catch (error) {
      setFeedback({ message: error?.message || 'Verification failed. Code may be invalid or expired.', type: 'error' });
    } finally {
      setIsVerifying(false);
    }
  };

  // Wrapper for the manual resend button
  const handleManualResend = () => {
    sendVerificationCode(emailForVerification);
  };

  return (
    <Dialog open={!!open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Suspense fallback={<div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          {localView === 'verify' ? (
            <VerificationView
              userEmail={emailForVerification}
              onVerify={handleVerify}
              onResendClick={handleManualResend}
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
                
                {/* OAuth Section */}
                <div className="space-y-4 mb-6">
                  <GoogleLoginButton 
                    redirectTo={window.location.href} 
                    onBeforeRedirect={onSaveFormData}
                  />
                  <LinkedInLoginButton 
                    redirectTo={window.location.href}
                    onBeforeRedirect={onSaveFormData}
                  />
                </div>
                
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>
                
                <LoginForm onSubmit={handleLogin} isLoading={isSubmitting} apiError={authError} />
              </TabsContent>
              <TabsContent value="signup" className="pt-6">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-bold text-center">Create Your Account</DialogTitle>
                  <DialogDescription className="text-center">Sign up to get started.</DialogDescription>
                </DialogHeader>
                
                {/* OAuth Section */}
                <div className="space-y-4 mb-6">
                  <GoogleLoginButton 
                    redirectTo={window.location.href} 
                    onBeforeRedirect={onSaveFormData}
                  />
                  <LinkedInLoginButton 
                    redirectTo={window.location.href}
                    onBeforeRedirect={onSaveFormData}
                  />
                </div>
                
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>
                
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