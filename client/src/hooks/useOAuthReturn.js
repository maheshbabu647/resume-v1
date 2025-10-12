import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthContext from './useAuth.js';

/**
 * Hook to handle OAuth return and restore user data
 * This hook should be used in the main App component or a high-level component
 * to handle OAuth returns and restore user state
 */
export const useOAuthReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, checkStatus } = useAuthContext();

  const restoreUserState = useCallback(() => {
    try {
      const savedState = localStorage.getItem('resume_editor_state');
      if (savedState) {
        const state = JSON.parse(savedState);
        const now = Date.now();
        const stateAge = now - state.timestamp;
        
        // Only restore state if it's less than 10 minutes old
        if (stateAge < 10 * 60 * 1000) {
          // Clear the saved state
          localStorage.removeItem('resume_editor_state');
          
          // Navigate back to the original URL
          if (state.url && state.url !== window.location.href) {
            // If it's a full URL, extract just the path
            if (state.url.startsWith('http')) {
              const url = new URL(state.url);
              navigate(url.pathname + url.search, { replace: true });
            } else {
              navigate(state.url, { replace: true });
            }
            return true;
          }
        } else {
          // Clear old state
          localStorage.removeItem('resume_editor_state');
        }
      }
    } catch (error) {
      console.warn('Could not restore state from localStorage:', error);
      localStorage.removeItem('resume_editor_state');
    }
    return false;
  }, [navigate]);

  useEffect(() => {
    // Skip OAuth handling if we're on the OAuth return page (it handles its own logic)
    if (location.pathname === '/oauth-return') {
      return;
    }
    
    // Check if user just returned from OAuth authentication
    if (isAuthenticated) {
      // First try to restore saved state
      const restored = restoreUserState();
      
      if (!restored) {
        // If no state to restore, check if there's a redirect parameter
        const urlParams = new URLSearchParams(location.search);
        const redirectUrl = urlParams.get('redirect');
        
        if (redirectUrl) {
          try {
            const decodedUrl = decodeURIComponent(redirectUrl);
            // If it's a full URL, extract just the path
            if (decodedUrl.startsWith('http')) {
              const url = new URL(decodedUrl);
              navigate(url.pathname + url.search, { replace: true });
            } else {
              navigate(decodedUrl, { replace: true });
            }
          } catch (error) {
            console.warn('Could not decode redirect URL:', error);
            navigate('/dashboard', { replace: true });
          }
        }
      }
    }
  }, [isAuthenticated, location, restoreUserState, navigate]);

  return {
    restoreUserState
  };
};
