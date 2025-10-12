import React from 'react';
import { Button } from "@/components/ui/button";

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 398.5 0 256S110.3 0 244 0c73 0 134.3 29.1 179.8 73.4l-63.8 63.8C297.7 96.5 272.2 82 244 82c-66.2 0-120 53.8-120 120s53.8 120 120 120c72.4 0 108.8-43.1 113.8-66.3H244v-76.9h234.3c2.6 13.2 4.7 27.4 4.7 42.8z"></path>
  </svg>
);

const GoogleLoginButton = ({ redirectTo = null, onBeforeRedirect = null }) => {
  // Get current page URL as redirect parameter
  const currentUrl = redirectTo || window.location.href;
  
  const handleGoogleAuth = () => {
    console.log('Google OAuth initiated, saving form data...');
    
    // Save current form data to localStorage before redirecting
    if (onBeforeRedirect) {
      console.log('Calling onBeforeRedirect to save form data');
      onBeforeRedirect();
    }
    
    // Save current page state to localStorage
    const currentState = {
      url: window.location.href,
      timestamp: Date.now(),
      formData: null // Will be populated by parent component if needed
    };
    
    try {
      localStorage.setItem('resume_editor_state', JSON.stringify(currentState));
      console.log('Page state saved to localStorage');
    } catch (error) {
      console.warn('Could not save state to localStorage:', error);
    }
    
    // Use only the pathname and search params, not the full URL
    const url = new URL(currentUrl);
    const redirectPath = url.pathname + url.search;
    const encodedRedirectPath = encodeURIComponent(redirectPath);
    
    console.log('Redirecting to Google OAuth with path:', redirectPath);
    
    // Redirect to Google OAuth
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?redirect=${encodedRedirectPath}`;
  };

  return (
    <Button variant="outline" type="button" className="w-full" onClick={handleGoogleAuth}>
      <GoogleIcon />
      Sign in with Google
    </Button>
  );
};

export default GoogleLoginButton;