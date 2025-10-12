import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const getErrorMessage = (error) => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  
  // Handle different error formats
  if (error.message) {
    if (typeof error.message === 'string') {
      return error.message;
    }
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
  
  // Handle validation errors specifically
  if (error.validation) {
    if (typeof error.validation === 'string') return error.validation;
    if (Array.isArray(error.validation)) {
      return error.validation.join(', ');
    }
  }
  
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    setFormError('');
    
    // Real-time password strength checking
    if (e.target.name === 'userPassword') {
      const errors = validatePassword(e.target.value);
      setPasswordStrength({
        score: Math.max(0, 5 - errors.length),
        feedback: errors
      });
    }
  };

  // Password strength validation function
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('one special character');
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormError('');
    
    // Check if all fields are filled
    if (
      !formData.userName ||
      !formData.userEmail ||
      !formData.userPassword ||
      !formData.userConfirmPassword
    ) {
      setFormError('Please fill in all fields.');
      return;
    }

    // Validate name format
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.userName.trim())) {
      setFormError('Full name can only contain letters and spaces.');
      return;
    }

    // Validate name length
    if (formData.userName.trim().length < 2) {
      setFormError('Full name must be at least 2 characters long.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(formData.userPassword);
    if (passwordErrors.length > 0) {
      setFormError(`Password must contain ${passwordErrors.join(', ')}.`);
      return;
    }

    // Check if passwords match
    if (formData.userPassword !== formData.userConfirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    
    setFormError('');
    onSubmit({
      userName: formData.userName.trim(),
      userEmail: formData.userEmail.trim(),
      userPassword: formData.userPassword
    });
  };

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
      <motion.div 
        className="space-y-1.5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Label htmlFor="signup-name" className="text-sm font-medium text-muted-foreground">
          Full Name
        </Label>
        <div className="relative group">
          <User
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200"
            aria-hidden="true"
          />
          <Input
            id="signup-name"
            type="text"
            name="userName"
            placeholder="Your Name"
            value={formData.userName}
            onChange={handleChange}
            className="pl-10 w-full bg-background/50 backdrop-blur-sm border-input focus:border-primary focus:ring-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all duration-200 hover:border-primary/50"
            required
            autoComplete="name"
          />
        </div>
      </motion.div>
      <motion.div 
        className="space-y-1.5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Label htmlFor="signup-email" className="text-sm font-medium text-muted-foreground">
          Email Address
        </Label>
        <div className="relative group">
          <Mail
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200"
            aria-hidden="true"
          />
          <Input
            id="signup-email"
            type="email"
            name="userEmail"
            placeholder="you@example.com"
            value={formData.userEmail}
            onChange={handleChange}
            className="pl-10 w-full bg-background/50 backdrop-blur-sm border-input focus:border-primary focus:ring-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all duration-200 hover:border-primary/50"
            required
            autoComplete="email"
          />
        </div>
      </motion.div>
      <motion.div 
        className="space-y-1.5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Label htmlFor="signup-password" className="text-sm font-medium text-muted-foreground">
          Password
        </Label>
        <div className="relative group">
          <Lock
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200"
            aria-hidden="true"
          />
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            name="userPassword"
            placeholder="••••••••"
            value={formData.userPassword}
            onChange={handleChange}
            className="pl-10 pr-10 w-full bg-background/50 backdrop-blur-sm border-input focus:border-primary focus:ring-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all duration-200 hover:border-primary/50"
            required
            minLength={8}
            autoComplete="new-password"
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
         <div className="pt-1">
           <p className="text-xs text-muted-foreground/80 mb-2">Must contain: 8+ characters, uppercase, lowercase, number, and special character.</p>
           
           {/* Password Strength Indicator */}
           {formData.userPassword && (
             <div className="space-y-1">
               <div className="flex items-center gap-2">
                 <span className="text-xs font-medium text-muted-foreground">Strength:</span>
                 <div className="flex gap-1">
                   {[1, 2, 3, 4, 5].map((level) => (
                     <div
                       key={level}
                       className={`h-1 w-4 rounded-full transition-colors duration-200 ${
                         level <= passwordStrength.score
                           ? passwordStrength.score <= 2
                             ? 'bg-destructive'
                             : passwordStrength.score <= 3
                             ? 'bg-yellow-500'
                             : 'bg-success'
                           : 'bg-muted'
                       }`}
                     />
                   ))}
                 </div>
                 <span className={`text-xs font-medium ${
                   passwordStrength.score <= 2 ? 'text-destructive' :
                   passwordStrength.score <= 3 ? 'text-yellow-600' :
                   'text-success'
                 }`}>
                   {passwordStrength.score <= 2 ? 'Weak' :
                    passwordStrength.score <= 3 ? 'Fair' :
                    passwordStrength.score <= 4 ? 'Good' : 'Strong'}
                 </span>
               </div>
               
               {/* Real-time feedback */}
               {passwordStrength.feedback.length > 0 && (
                 <div className="text-xs text-muted-foreground">
                   <span className="font-medium">Still needed:</span> {passwordStrength.feedback.join(', ')}
                 </div>
               )}
             </div>
           )}
         </div>
      </motion.div>
      <motion.div 
        className="space-y-1.5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-muted-foreground">
          Confirm Password
        </Label>
        <div className="relative group">
          <Lock
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200"
            aria-hidden="true"
          />
          <Input
            id="signup-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="userConfirmPassword"
            placeholder="••••••••"
            value={formData.userConfirmPassword}
            onChange={handleChange}
            className="pl-10 pr-10 w-full bg-background/50 backdrop-blur-sm border-input focus:border-primary focus:ring-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all duration-200 hover:border-primary/50"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <motion.button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {showConfirmPassword ? (
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
            <AlertTitle className="font-medium">Signup Error</AlertTitle>
            <AlertDescription className="text-xs">
              {displayError}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary via-accent-purple to-primary text-primary-foreground hover:from-primary/90 hover:via-accent-purple/90 hover:to-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out py-3 text-base font-semibold rounded-xl"
          aria-busy={isLoading}
          aria-label="Create your account"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
      </motion.div>
    </motion.form>
  );
};

export default SignupForm;