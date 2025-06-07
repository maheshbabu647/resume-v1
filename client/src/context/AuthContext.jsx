import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authStatus, userSignin, userSignout, userSignup } from '../api/authServiceApi.js';

const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        userData: null,
        isAuthenticated: false,
        isLoading: true, // Start true for initial status check
        error: null
    });

    // This function is now the single source of truth for setting user data
    const checkStatus = useCallback(async () => {
        try {
            const response = await authStatus();
            if (response.success && response.data) {
                const { userName, userEmail, userRole, isVerified } = response.data;
                const userData = { userName, userEmail, userRole, isVerified };
                setAuthState({ userData, isAuthenticated: true, isLoading: false, error: null });
            } else {
                setAuthState({ userData: null, isAuthenticated: false, isLoading: false, error: null });
            }
        } catch (error) {
            console.error("Auth status check failed:", error);
            setAuthState({ userData: null, isAuthenticated: false, isLoading: false, error: null });
        }
    }, []);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    const signin = useCallback(async (signinCredentials) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await userSignin(signinCredentials);
            if (response.success) {
                // FIX: Instead of setting state from the login response,
                // call checkStatus() to get the freshest, most complete user profile.
                // This ensures the isVerified flag is correctly populated before navigation.
                await checkStatus(); 
                return true;
            } else {
                throw new Error(response.message || 'Login failed.');
            }
        } catch (error) {
            const errorMessage = error.response?.data || { message: error.message || 'An unknown error occurred during login.' };
            setAuthState({ userData: null, isAuthenticated: false, isLoading: false, error: errorMessage });
            return false;
        }
    }, [checkStatus]); // Add checkStatus as a dependency

    const signup = useCallback(async (signupCredentials) => {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await userSignup(signupCredentials);
            if (response.success) {
                // After signup, immediately get the full user status
                await checkStatus();
                return true;
            } else {
                throw new Error(response.message || "Something went wrong during signup.");
            }
        } catch (error) {
            const errorMessage = error.response?.data || { message: error.message || 'An unknown error occurred during signup.' };
            setAuthState({ userData: null, isAuthenticated: false, isLoading: false, error: errorMessage });
            return false;
        }
    }, [checkStatus]); // Add checkStatus as a dependency

    const signout = useCallback(async () => {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            await userSignout();
        } catch (error) {
            console.error("Server signout failed, signing out locally.", error);
        } finally {
            setAuthState({ userData: null, isAuthenticated: false, isLoading: false, error: null });
        }
    }, []);

    const value = { ...authState, signin, signup, signout, checkStatus };

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider };
