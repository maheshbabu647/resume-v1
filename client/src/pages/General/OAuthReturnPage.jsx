import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '@/hooks/useAuth';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

const OAuthReturnPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAuthLoading } = useAuthContext();
  
  console.log('OAuthReturnPage: isAuthenticated =', isAuthenticated, 'isAuthLoading =', isAuthLoading);

  useEffect(() => {
    // Wait for auth to finish loading
    if (isAuthLoading) {
      console.log('OAuth: Auth still loading, waiting...');
      return;
    }
    
    if (isAuthenticated) {
      // Check for saved state in localStorage
      try {
        const savedState = localStorage.getItem('resume_editor_state');
        if (savedState) {
          const state = JSON.parse(savedState);
          const now = Date.now();
          const stateAge = now - state.timestamp;
          
          // Only restore state if it's less than 10 minutes old
          if (stateAge < 10 * 60 * 1000) {
            console.log('OAuth: Restoring saved state:', state);
            // Clear the saved state
            localStorage.removeItem('resume_editor_state');
            
            // Navigate back to the original URL
            if (state.url && state.url !== window.location.href) {
              // If it's a full URL, extract just the path
              if (state.url.startsWith('http')) {
                const url = new URL(state.url);
                console.log('OAuth: Redirecting to:', url.pathname + url.search);
                navigate(url.pathname + url.search, { replace: true });
              } else {
                console.log('OAuth: Redirecting to:', state.url);
                navigate(state.url, { replace: true });
              }
              return;
            }
          } else {
            // Clear old state
            localStorage.removeItem('resume_editor_state');
          }
        }
      } catch (error) {
        console.warn('OAuth: Could not restore state from localStorage:', error);
        localStorage.removeItem('resume_editor_state');
      }
      
      // If no saved state or restoration failed, go to dashboard
      console.log('OAuth: No saved state, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    } else {
      // If not authenticated, redirect to home
      console.log('OAuth: Not authenticated, redirecting to home');
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-muted-foreground">Completing sign-in...</p>
      </div>
    </div>
  );
};

export default OAuthReturnPage;
