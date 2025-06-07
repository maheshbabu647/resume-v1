import React, { createContext, useState, useCallback, useContext } from 'react';
import { 
    getAllCoverLetters as apiGetAll,
    deleteCoverLetter as apiDelete
} from '../api/coverLetterServiceApi.js';
import useAuthContext from '../hooks/useAuth.js';

const CoverLetterContext = createContext(null);

export const CoverLetterContextProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    const [coverLetters, setCoverLetters] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCoverLetters = useCallback(async () => {
        if (!isAuthenticated) {
            setCoverLetters([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const data = await apiGetAll();
            setCoverLetters(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || 'Failed to fetch cover letters.');
            setCoverLetters([]);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const deleteCoverLetterById = useCallback(async (letterId) => {
        if (!isAuthenticated) {
            setError('Authentication required.');
            return false;
        }
        
        try {
            await apiDelete(letterId);
            setCoverLetters(prev => prev.filter(letter => letter._id !== letterId));
            return true;
        } catch (err) {
            setError(err.message || 'Failed to delete cover letter.');
            return false;
        }
    }, [isAuthenticated]);

    const contextValue = {
        coverLetters,
        isLoading,
        error,
        fetchCoverLetters,
        deleteCoverLetterById
    };

    return (
        <CoverLetterContext.Provider value={contextValue}>
            {children}
        </CoverLetterContext.Provider>
    );
};

export const useCoverLetterContext = () => {
    const context = useContext(CoverLetterContext);
    if (!context) {
        throw new Error('useCoverLetterContext must be used within a CoverLetterContextProvider');
    }
    return context;
};
