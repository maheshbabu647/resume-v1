import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { resetPassword as apiResetPassword } from '@/api/authServiceApi';

// Helper component for displaying password validation rules
const PasswordValidationRule = ({ isValid, text }) => (
  <div className={`flex items-center text-sm ${isValid ? 'text-green-600' : 'text-muted-foreground'}`}>
    {isValid ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <AlertCircle className="h-4 w-4 mr-2" />}
    {text}
  </div>
);

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [matchError, setMatchError] = useState('');

  // Memoized password validation checks
  const passwordValidation = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMatchError('');
    setApiError(null);

    // 1. Check if passwords match
    if (password !== confirmPassword) {
      setMatchError("Passwords do not match.");
      return;
    }
    
    // 2. Check if the password meets all validation rules
    if (!isPasswordValid) {
      setMatchError("Your password does not meet all the required criteria.");
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const response = await apiResetPassword(token, { userPassword: password });
      setSuccessMessage(response.message);
      setTimeout(() => navigate('/dashboard'), 3000); // Redirect after 3s
    } catch (err) {
      setApiError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <Helmet>
        <title>Reset Password | CareerForge</title>
      </Helmet>

      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="bg-card text-card-foreground shadow-2xl rounded-xl">
            <CardHeader className="text-center p-6 sm:p-8">
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Set New Password</CardTitle>
              <CardDescription className="text-muted-foreground pt-1">
                Choose a new, strong password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 pt-0">
              {successMessage ? (
                <Alert variant="default" className="bg-green-500/10 border-green-500/40 text-green-700">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{successMessage} Redirecting you to the dashboard...</AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* New Password Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="reset-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reset-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3" disabled={isLoading}>
                        {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Validation Rules */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-2">
                    <PasswordValidationRule isValid={passwordValidation.length} text="At least 8 characters" />
                    <PasswordValidationRule isValid={passwordValidation.uppercase} text="One uppercase letter" />
                    <PasswordValidationRule isValid={passwordValidation.lowercase} text="One lowercase letter" />
                    <PasswordValidationRule isValid={passwordValidation.number} text="One number" />
                    <PasswordValidationRule isValid={passwordValidation.special} text="One special symbol" />
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                       <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3" disabled={isLoading}>
                        {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Display API or Match Errors */}
                  {(apiError || matchError) && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{apiError || matchError}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" disabled={isLoading || !isPasswordValid || password !== confirmPassword} className="w-full !mt-6">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting Password...</> : 'Reset Password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </>
  );
};

export default ResetPasswordPage;