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
    
    // Clear previous errors
    setFormError('');
    
    // Check if fields are filled
    if (!formData.userEmail || !formData.userPassword) {
      setFormError('Please enter both email and password.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    // Check password length
    if (formData.userPassword.length < 1) {
      setFormError('Please enter your password.');
      return;
    }
    
    setFormError('');
    onSubmit({
      userEmail: formData.userEmail.trim(),
      userPassword: formData.userPassword
    });
  };

 const getErrorMessage = (error) => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  
  // Handle different error formats
  if (error.message) {
    if (typeof error.message === 'string') return error.message;
    if (Array.isArray(error.message)) {
      return error.message
        .map(err => err.message || JSON.stringify(err))
        .join('; ');
    }
    if (typeof error.message === 'object' && error.message !== null) {
      return error.message.message || JSON.stringify(error.message);
    }
  }
  
  // Handle common API error patterns
  if (error.error) {
    if (typeof error.error === 'string') return error.error;
    if (error.error.message) return error.error.message;
  }
  
  if (error.details) {
    if (typeof error.details === 'string') return error.details;
  }
  
  if (error.msg) return error.msg;
  
  // Handle authentication specific errors
  if (error.auth) {
    if (typeof error.auth === 'string') return error.auth;
  }
  
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
      <motion.div 
        className="space-y-1.5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Label htmlFor="login-email" className="text-sm font-medium text-muted-foreground">
          Email Address
        </Label>
        <div className="relative group">
          <Mail
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200"
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
            className="pl-10 w-full bg-background/50 backdrop-blur-sm border-input focus:border-primary focus:ring-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all duration-200 hover:border-primary/50"
            required
            aria-describedby={displayError && formData.userEmail === '' ? "error-message" : undefined}
          />
        </div>
      </motion.div>

      <motion.div 
        className="space-y-1.5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Label htmlFor="login-password" className="text-sm font-medium text-muted-foreground">
          Password
        </Label>
        <div className="relative group">
          <Lock
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200"
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
            className="pl-10 pr-10 w-full bg-background/50 backdrop-blur-sm border-input focus:border-primary focus:ring-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all duration-200 hover:border-primary/50"
            required
            aria-describedby={displayError && formData.userPassword === '' ? "error-message" : undefined}
          />
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </motion.div>

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary via-accent-purple to-primary text-primary-foreground hover:from-primary/90 hover:via-accent-purple/90 hover:to-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out py-3 text-base font-semibold rounded-xl"
          aria-busy={isLoading}
          aria-label={isLoading ? "Logging In..." : "Log In to your account"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
      </motion.div>
    </motion.form>
  );
};

export default LoginForm;