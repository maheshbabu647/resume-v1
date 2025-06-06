import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LoginForm = ({ onSubmit, isLoading, apiError }) => {
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: '',
  });
  const [formError, setFormError] = useState(''); // For client-side validation errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(''); // Clear client-side error on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userEmail || !formData.userPassword) {
      setFormError('Please enter both email and password.');
      return;
    }
    // Clear client-side error before submitting
    setFormError('');
    onSubmit(formData);
  };

  // Determine the error message to display
  let displayError = formError; // Prioritize client-side form errors
  if (!displayError && apiError) {
    // apiError could be an object { message: "..." } or a string
    displayError = typeof apiError === 'string' ? apiError : apiError.message || apiError.msg || 'Login failed. Please try again.';
  }


  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }} // Slight delay after page animation
      onSubmit={handleSubmit}
      className="space-y-6" // Increased spacing between elements
      aria-label="Login Form"
      noValidate
    >
      {/* Email Field */}
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
            autoComplete="email" // Corrected from "username" for email field
            placeholder="you@example.com"
            value={formData.userEmail}
            onChange={handleChange}
            className="pl-10 w-full bg-background border-input focus:border-primary focus:ring-primary" // Theme-aware classes
            required
            aria-describedby={displayError && formData.userEmail === '' ? "error-message" : undefined}
          />
        </div>
      </div>

      {/* Password Field */}
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
            type="password"
            name="userPassword"
            autoComplete="current-password"
            placeholder="••••••••"
            value={formData.userPassword}
            onChange={handleChange}
            className="pl-10 w-full bg-background border-input focus:border-primary focus:ring-primary" // Theme-aware classes
            required
            aria-describedby={displayError && formData.userPassword === '' ? "error-message" : undefined}
          />
        </div>
      </div>

      {/* Error Message Display */}
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

      {/* Submit Button */}
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
