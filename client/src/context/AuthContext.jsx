import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authStatus, userSignin, userSignout, userSignup } from '../api/authServiceApi.js';

const AuthContext = createContext(null);

/**
 * Provides authentication state and actions to its children.
 * Manages user data, authentication status, loading states, and errors.
 */
const AuthContextProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        userData: null,
        isAuthenticated: false,
        isLoading: true, // isLoading is true on initial mount for checkStatus
        error: null,
    });

    /**
     * Checks the user's authentication status with the backend.
     */
    const checkStatus = useCallback(async () => {
        // We don't set isLoading here to prevent the whole app from unmounting
        try {
            const response = await authStatus();
            if (response.success && response.data) {
                const { userName, userEmail, userRole, isVerified } = response.data;
                const userData = { userName, userEmail, userRole, isVerified };
                setAuthState({ userData, isAuthenticated: true, isLoading: false, error: null });
                return response.data;
            } else {
                setAuthState({ userData: null, isAuthenticated: false, isLoading: false, error: null });
                return null;
            }
        } catch (error) {
            console.error("Auth status check failed:", error);
            setAuthState({ userData: null, isAuthenticated: false, isLoading: false, error: null });
            return null;
        }
    }, []);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    /**
     * Handles the user sign-in process.
     */
    const signin = useCallback(async (signinCredentials) => {
        setAuthState(prev => ({...prev, isLoading: true, error: null}));
        try {
            await userSignin(signinCredentials);
            const freshUserData = await checkStatus();
            return freshUserData;
        } catch (error) {
            const errorMessage = error.response?.data || { message: error.message || 'An unknown error occurred.' };
            setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            return null;
        }
    }, [checkStatus]);

    /**
     * Handles the user sign-up process.
     */
    const signup = useCallback(async (signupCredentials) => {
        setAuthState(prev => ({...prev, isLoading: true, error: null}));
        try {
            await userSignup(signupCredentials);
            setAuthState(prev => ({...prev, isLoading: false}));
            return true;
        } catch (error) {
            const errorMessage = error.response?.data || { message: error.message || 'An unknown error occurred.' };
            setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            return false;
        }
    }, []);

    /**
     * Handles the user sign-out process.
     */
    const signout = useCallback(async () => {
        setAuthState((prev) => ({ ...prev, isLoading: true }));
        try {
            await userSignout();
        } catch (error) {
            console.error("Server signout failed, signing out locally regardless.", error);
        } finally {
            setAuthState({ userData: null, isAuthenticated: false, isLoading: false, error: null });
        }
    }, []);
    
    /**
     * Clears any existing authentication errors from the state.
     */
    const clearAuthError = useCallback(() => {
        setAuthState((prev) => ({ ...prev, error: null }));
    }, []);

    const value = { 
        ...authState, 
        signin, 
        signup, 
        signout, 
        checkStatus, 
        clearAuthError 
    };

    return (
        <AuthContext.Provider value={value}>
            {/* MODIFICATION: 
              We now render children unconditionally. The initial loading state is 
              handled by setting isLoading to true initially and false after the 
              first checkStatus. Your pages already handle their own loading UI,
              so we don't need to hide the entire app.
            */}
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy consumption of the context.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
}

export { AuthContext, AuthContextProvider };