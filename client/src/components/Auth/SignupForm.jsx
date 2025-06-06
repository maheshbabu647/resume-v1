import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SignupForm = ({ onSubmit, isLoading, apiError }) => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    userConfirmPassword: '',
  });
  const [formError, setFormError] = useState(''); // For client-side validation errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(''); // Clear client-side error on change
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
    // Client-side password length check (API has stricter rules: 8 chars, uppercase, lowercase, number, symbol)
    // It's good to provide a basic hint here, but rely on API for full validation.
    if (formData.userPassword.length < 6) { // Original client check was 6
      setFormError('Password must be at least 6 characters. For security, aim for 8+ with mixed characters.');
      return;
    }
    if (formData.userPassword !== formData.userConfirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    
    setFormError(''); // Clear client-side error before submitting
    onSubmit({
      userName: formData.userName,
      userEmail: formData.userEmail,
      userPassword: formData.userPassword
      // userConfirmPassword is not sent to API
    });
  };

  // Determine the error message to display
  let displayError = formError; // Prioritize client-side form errors
  if (!displayError && apiError) {
    // apiError could be an object { message: "...", name: "..." } or string
    if (typeof apiError === 'string') {
        displayError = apiError;
    } else if (apiError.name === "VALIDATION_ERROR" && Array.isArray(apiError.message)) {
        // Flatten API validation errors for display
        displayError = apiError.message.map(err => `${err.field}: ${err.message}`).join('; ');
    } else {
        displayError = apiError.message || apiError.msg || 'Signup failed. Please try again.';
    }
  }

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
      {/* Full Name Field */}
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
            aria-describedby={displayError && formData.userName === '' ? "error-message" : undefined}
          />
        </div>
      </div>

      {/* Email Field */}
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
            aria-describedby={displayError && formData.userEmail === '' ? "error-message" : undefined}
          />
        </div>
      </div>

      {/* Password Field */}
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
            placeholder="•••••••• (min. 8, complex)"
            value={formData.userPassword}
            onChange={handleChange}
            className="pl-10 w-full bg-background border-input focus:border-primary focus:ring-primary"
            required
            minLength={6} // HTML5 validation, API is stricter
            autoComplete="new-password"
            aria-describedby={displayError && formData.userPassword === '' ? "error-message" : undefined}
          />
        </div>
         <p className="text-xs text-muted-foreground/80 pt-1">Min. 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol.</p>
      </div>

      {/* Confirm Password Field */}
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
            minLength={6}
            autoComplete="new-password"
            aria-describedby={displayError && formData.userConfirmPassword === '' ? "error-message" : undefined}
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
            <AlertTitle className="font-medium">Signup Error</AlertTitle>
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
        aria-label={isLoading ? "Creating Account..." : "Create your account"}
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
