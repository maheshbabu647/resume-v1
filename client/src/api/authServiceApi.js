import apiServer from "./index.js";

export const userSignin = async (signinCredentials) => {
    try{
        const response = await apiServer.post('/auth/signin', signinCredentials)
        return response.data
    }
    catch (error) {
        throw error.response?.data || { message : 'Login failed. Network error or Server unavailable.' }
    }
}

export const userSignup = async (signupCredentials) => {
    try{
        const response = await apiServer.post('/auth/signup', signupCredentials)
        return response.data
    }
    catch (error) {
        throw error.response?.data || { message : 'Signup failed. Network error or Server unavailable.' }
    }
}

export const authStatus = async () => {
    try{
        const response = await apiServer.get('/auth/status')
        return response.data
    }
    catch (error) {
        if( error.response && (error.response.status === 401 || error.response.status === 403)) {
            return { success: false, user: null }
        } 
        throw error.response?.data || { message : 'Failed to check authentication status. '}
    }
}

export const userSignout = async () => {
    try{
        const response = await apiServer.post('/auth/signout')
        return response.data
    }
    catch (error) {
        console.log('Logout api call failed : ', error)
        throw error.response?.data || { message : 'Logout failed on server.'}
    }
}

export const forgotPassword = async (emailData) => {
    try {
        const response = await apiServer.post('/auth/forgot-password', emailData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to send password reset email.' };
    }
};

export const resetPassword = async (token, passwordData) => {
    try {
        const response = await apiServer.put(`/auth/reset-password/${token}`, passwordData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to reset password.' };
    }
};

export const verifyEmail = async (token) => {
    try {
        const response = await apiServer.post(`/auth/verify-email/${token}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to verify email.' };
    }
};

// --- New Function ---
/**
 * Requests a new verification link to be sent to the user's email.
 * @param {object} emailData - The user's email, e.g., { userEmail: "user@example.com" }
 * @returns {Promise<object>} A promise that resolves to the API success response.
 */
export const resendVerification = async (emailData) => {
    try {
        const response = await apiServer.post('/auth/resend-verification', emailData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to resend verification link.' };
    }
};
