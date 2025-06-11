import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authStatus, userSignin, userSignout, userSignup } from '../api/authServiceApi.js';

const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        userData: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
    });

    const checkStatus = useCallback(async () => {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        try {
            const response = await authStatus();
            if (response.success && response.data) {
                const { userName, userEmail, userRole, isVerified } = response.data;
                const userData = { userName, userEmail, userRole, isVerified };
                setAuthState({ userData, isAuthenticated: true, isLoading: false, error: null, isVerified: userData.isVerified });
                return response.data; // Return data for immediate use
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

    const signin = useCallback(async (signinCredentials) => {
        try {
            await userSignin(signinCredentials);
            // --- MODIFICATION START ---
            // After a successful API login, call checkStatus to get the latest
            // user data (including the isVerified flag) and return it.
            const userData = await checkStatus();
            return userData;
            // --- MODIFICATION END ---
        } catch (error) {
            const errorMessage = error.response?.data || { message: error.message || 'An unknown error occurred.' };
            setAuthState(prev => ({ ...prev, error: errorMessage }));
            return null; // Return null on failure
        }
    }, [checkStatus]);

    const signup = useCallback(async (signupCredentials) => {
        try {
            await userSignup(signupCredentials);
            return true;
        } catch (error) {
            const errorMessage = error.response?.data || { message: error.message || 'An unknown error occurred.' };
            setAuthState(prev => ({...prev, error: errorMessage}));
            return false;
        }
    }, []);

    const signout = useCallback(async () => {
        setAuthState((prev) => ({ ...prev, isLoading: true }));
        try {
            await userSignout();
        } catch (error) {
            console.error("Server signout failed, signing out locally.", error);
        } finally {
            setAuthState({ userData: null, isAuthenticated: false, isLoading: false, error: null });
        }
    }, []);
    
    const clearAuthError = useCallback(() => {
        setAuthState((prev) => ({ ...prev, error: null }));
    }, []);

    const value = { ...authState, signin, signup, signout, checkStatus, clearAuthError };

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider };