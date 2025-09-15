import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LoginForm = ({ onSubmit, isLoading, apiError }) => {
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userEmail || !formData.userPassword) {
      setFormError('Please enter both email and password.');
      return;
    }
    setFormError('');
    onSubmit(formData);
  };

 const getErrorMessage = (error) => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (error.message) return error.message; // Extracts the string
  if (error.msg) return error.msg;         // Also checks for .msg
  
  // Fallback to prevent rendering an object
  return 'An unexpected error occurred. Please try again.';
};

// Use the helper function to determine the error message
const displayError = formError || (apiError ? getErrorMessage(apiError) : '');
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label="Login Form"
      noValidate
    >
      <div className="space-y-1.5">
        <Label htmlFor="login-email" className="text-sm font-medium text-muted-foreground">
          Email Address
        </Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="login-email"
            type="email"
            name="userEmail"
            autoComplete="email"
            placeholder="you@example.com"
            value={formData.userEmail}
            onChange={handleChange}
            className="pl-10 w-full bg-background border-input focus:border-primary focus:ring-primary placeholder:text-muted-foreground/60"
            required
            aria-describedby={displayError && formData.userEmail === '' ? "error-message" : undefined}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="login-password" className="text-sm font-medium text-muted-foreground">
          Password
        </Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            name="userPassword"
            autoComplete="current-password"
            placeholder="••••••••"
            value={formData.userPassword}
            onChange={handleChange}
            className="pl-10 pr-10 w-full bg-background border-input focus:border-primary focus:ring-primary placeholder:text-muted-foreground/60"
            required
            aria-describedby={displayError && formData.userPassword === '' ? "error-message" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {displayError && (
        <motion.div
          id="error-message"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
        >
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-medium">Login Error</AlertTitle>
            <AlertDescription className="text-xs">
              {displayError}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background shadow-md hover:shadow-lg transition-all duration-150 ease-in-out py-3 text-base"
        aria-busy={isLoading}
        aria-label={isLoading ? "Logging In..." : "Log In to your account"}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Logging In...
          </>
        ) : (
          'Log In'
        )}
      </Button>
    </motion.form>
  );
};

export default LoginForm;