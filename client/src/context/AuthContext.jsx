import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authStatus, userSignin, userSignout, userSignup, resendVerification } from '../api/authServiceApi.js';

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
    // const signin = useCallback(async (signinCredentials) => {
    //     setAuthState(prev => ({...prev, isLoading: true, error: null}));
    //     try {
    //         await userSignin(signinCredentials);
    //         const freshUserData = await checkStatus();
    //         return freshUserData;
    //     } catch (error) {
    //         // Extracts the string message from the error object before setting state.
    //         const rawError = error.response?.data;
    //         let finalMessage = 'An unknown error occurred.';

    //         if (rawError) {
    //             if (typeof rawError === 'string') {
    //                 finalMessage = rawError;
    //             } else if (rawError.message) { // Handles objects like { message: '...' } or { field: '...', message: '...' }
    //                 finalMessage = rawError.message;
    //             } else if (rawError.msg) { // Also handles objects with a 'msg' property
    //                 finalMessage = rawError.msg;
    //             }
    //         } else if (error.message) {
    //             finalMessage = error.message; // Fallback to generic JS error message
    //         }

    //         setAuthState(prev => ({ ...prev, isLoading: false, error: finalMessage }));
    //         return null;
    //     }
    // }, [checkStatus]);

    const signin = useCallback(async (signinCredentials) => {
        // The context no longer sets its own loading state here.
        // The component calling this function is responsible for its UI loading state.
        try {
            await userSignin(signinCredentials);
            const freshUserData = await checkStatus(); // checkStatus will update user data and set isLoading: false
            return freshUserData;
        } catch (error) {
            // Extracts and sets the error message in the context state.
            const rawError = error.response?.data;
            let finalMessage = 'An unknown error occurred.';

            if (rawError) {
                if (typeof rawError === 'string') {
                    finalMessage = rawError;
                } else if (rawError.message) {
                    finalMessage = rawError.message;
                } else if (rawError.msg) {
                    finalMessage = rawError.msg;
                }
            } else if (error.message) {
                finalMessage = error.message;
            }
            
            setAuthState(prev => ({ ...prev, error: finalMessage }));
            return null;
        }
    }, [checkStatus]);

    /**
     * Handles the user sign-up process.
     */
    // const signup = useCallback(async (signupCredentials) => {
    //     setAuthState(prev => ({...prev, isLoading: true, error: null}));
    //     try {
    //         await userSignup(signupCredentials);
    //         setAuthState(prev => ({...prev, isLoading: false}));
    //         return true;
    //     } catch (error) {
    //         // --- MODIFICATION START ---
    //         // Extracts the string message from the error object before setting state.
    //         const rawError = error.response?.data;
    //         let finalMessage = 'An unknown error occurred.';

    //         if (rawError) {
    //             if (typeof rawError === 'string') {
    //                 finalMessage = rawError;
    //             } else if (rawError.message) {
    //                 finalMessage = rawError.message;
    //             } else if (rawError.msg) {
    //                 finalMessage = rawError.msg;
    //             }
    //         } else if (error.message) {
    //             finalMessage = error.message;
    //         }
            
    //         setAuthState(prev => ({ ...prev, isLoading: false, error: finalMessage }));
    //         return false;
    //     }
    // }, []);

    const signup = useCallback(async (signupCredentials) => {
        // The context no longer sets its own loading state here.
        try {
            await userSignup(signupCredentials);
            return true;
        } catch (error) {
            // Extracts and sets the error message in the context state.
            const rawError = error.response?.data;
            let finalMessage = 'An unknown error occurred.';

            if (rawError) {
                if (typeof rawError === 'string') {
                    finalMessage = rawError;
                } else if (rawError.message) {
                    finalMessage = rawError.message;
                } else if (rawError.msg) {
                    finalMessage = rawError.msg;
                }
            } else if (error.message) {
                finalMessage = error.message;
            }
            
            setAuthState(prev => ({ ...prev, error: finalMessage }));
            return false;
        }
    }, []);

    const resendVerificationEmail = useCallback(async (emailData) => {
        try {
            // Set a temporary loading or info state if you want, or just fire and forget.
            await resendVerification(emailData);
            // Optionally, you could set a success message in a separate state.
            // For now, we'll just log success or handle errors.
            console.log("Verification email resent successfully.");
            return true;
        } catch (error) {
            console.error("Failed to resend verification email:", error);
            // You can reuse your existing error handling to display a message to the user
            const errorMessage = error.message || 'Failed to resend verification code.';
            setAuthState(prev => ({ ...prev, error: errorMessage }));
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
        clearAuthError,
        resendVerificationEmail
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