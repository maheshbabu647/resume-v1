import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * A robust helper function to extract a displayable error message from various
 * API error formats (string, object, or array of objects).
 * @param {*} error - The error object or string from the API.
 * @returns {string} A user-friendly error message string.
 */
const getErrorMessage = (error) => {
  if (!error) return '';
  if (typeof error === 'string') return error;

  // Handle errors that have a 'message' property
  if (error.message) {
    // If the message is a simple string, return it
    if (typeof error.message === 'string') {
      return error.message;
    }
    // If the message is an array (common for validation errors)
    if (Array.isArray(error.message)) {
      return error.message
        .map(err => err.message || JSON.stringify(err)) // Extract message from each error object
        .join('; '); // Join multiple error messages
    }
    // If the message is an object (single validation error)
    if (typeof error.message === 'object' && error.message !== null) {
      return error.message.message || JSON.stringify(error.message);
    }
  }

  // Fallback for any other unexpected error structure
  return 'An unexpected error occurred. Please check your input and try again.';
};


const SignupForm = ({ onSubmit, isLoading, apiError }) => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    userConfirmPassword: '',
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.userName ||
      !formData.userEmail ||
      !formData.userPassword ||
      !formData.userConfirmPassword
    ) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (formData.userPassword.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }
    if (formData.userPassword !== formData.userConfirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    
    setFormError('');
    onSubmit({
      userName: formData.userName,
      userEmail: formData.userEmail,
      userPassword: formData.userPassword
    });
  };

  // FIX: Use the robust error message helper to ensure we always have a string.
  const displayError = formError || getErrorMessage(apiError);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label="Signup Form"
      noValidate
    >
      <div className="space-y-1.5">
        <Label htmlFor="signup-name" className="text-sm font-medium text-muted-foreground">
          Full Name
        </Label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="signup-name"
            type="text"
            name="userName"
            placeholder="Your Name"
            value={formData.userName}
            onChange={handleChange}
            className="pl-10 w-full bg-background border-input focus:border-primary focus:ring-primary"
            required
            autoComplete="name"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signup-email" className="text-sm font-medium text-muted-foreground">
          Email Address
        </Label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="signup-email"
            type="email"
            name="userEmail"
            placeholder="you@example.com"
            value={formData.userEmail}
            onChange={handleChange}
            className="pl-10 w-full bg-background border-input focus:border-primary focus:ring-primary"
            required
            autoComplete="email"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signup-password" className="text-sm font-medium text-muted-foreground">
          Password
        </Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="signup-password"
            type="password"
            name="userPassword"
            placeholder="••••••••"
            value={formData.userPassword}
            onChange={handleChange}
            className="pl-10 w-full bg-background border-input focus:border-primary focus:ring-primary"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
         <p className="text-xs text-muted-foreground/80 pt-1">Min. 8 characters, with uppercase, lowercase, number, & symbol.</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-muted-foreground">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="signup-confirm-password"
            type="password"
            name="userConfirmPassword"
            placeholder="••••••••"
            value={formData.userConfirmPassword}
            onChange={handleChange}
            className="pl-10 w-full bg-background border-input focus:border-primary focus:ring-primary"
            required
            minLength={8}
            autoComplete="new-password"
          />
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
            <AlertTitle className="font-medium">Signup Error</AlertTitle>
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
        aria-label="Create your account"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </motion.form>
  );
};

export default SignupForm;
