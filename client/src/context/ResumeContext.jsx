/**
 * @fileoverview Resume Context - Global state management for resume operations
 * @module context/ResumeContext
 * @description Provides a React context for managing resume state, including
 * CRUD operations, editor state, and resume metadata. Centralizes all resume-related
 * data and operations for use throughout the application.
 */

import React, { createContext, useState, useCallback, useContext } from "react";
import useAuthContext from '../hooks/useAuth';
import {
    getAllResumes as apiGetAllResumes,
    getById as apiGetById,
    createResume as apiCreateResume,
    updateResume as apiUpdateResume,
    deleteResume as apiDeleteResume
} from '../api/resumeServiceApi.js';

/**
 * Resume context object
 * @type {React.Context}
 */
const ResumeContext = createContext(null);

// ============================================================================
// CONTEXT PROVIDER COMPONENT
// ============================================================================

/**
 * Resume Context Provider Component
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Context provider wrapping children
 * @description Provides resume state and operations to all child components.
 * Manages user's resume list, current resume being edited, editor form data,
 * and all resume customization settings.
 */
const ResumeContextProvider = ({ children }) => {
    const { isAuthenticated, userData } = useAuthContext();

    // ========================================================================
    // STATE - RESUME LIST
    // ========================================================================
    
    /** @type {[Array<Object>, Function]} User's list of resumes */
    const [userResumesList, setUserResumesList] = useState([]);
    /** @type {[boolean, Function]} Loading state for resume list */
    const [isLoadingUserResumes, setIsLoadingUserResumes] = useState(false);

    // ========================================================================
    // STATE - CURRENT RESUME
    // ========================================================================
    
    /** @type {[Object|null, Function]} Currently loaded resume details */
    const [currentResumeDetail, setCurrentResumeDetail] = useState(null);
    /** @type {[boolean, Function]} Loading state for current resume */
    const [isLoadingCurrentResume, setIsLoadingCurrentResume] = useState(false);
    /** @type {[Object, Function]} Editor form data (content and sectionsConfig) */
    const [editorFormData, setEditorFormData] = useState({});

    // ========================================================================
    // STATE - OPERATIONS
    // ========================================================================
    
    /** @type {[boolean, Function]} Saving state */
    const [isSavingResume, setIsSavingResume] = useState(false);
    /** @type {[boolean, Function]} Deleting state */
    const [isDeletingResume, setIsDeletingResume] = useState(false);
    /** @type {[string|null, Function]} Error message */
    const [resumeError, setResumeError] = useState(null);

    // ========================================================================
    // STATE - CUSTOMIZATION
    // ========================================================================
    
    /** @type {[number, Function]} Layout spacing multiplier (default: 1) */
    const [spacingMultiplier, setSpacingMultiplier] = useState(1);
    /** @type {[number, Function]} Font size multiplier (default: 1) */
    const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
    /** @type {[string|null, Function]} Selected style pack key */
    const [selectedStylePackKey, setSelectedStylePackKey] = useState(null);
    /** @type {[Array|null, Function]} Custom section ordering */
    const [sectionOrder, setSectionOrder] = useState(null);
    /** @type {[string|null, Function]} Target industry for resume */
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    /** @type {[Object|null, Function]} Resume setup wizard data */
    const [resumeSetupData, setResumeSetupData] = useState(null);

    // ========================================================================
    // OPERATIONS - LOAD RESUMES
    // ========================================================================

    /**
     * Loads all resumes for the authenticated user
     * @async
     * @function loadUserResumes
     * @returns {Promise<void>}
     * @description Fetches the user's complete resume list from the API.
     * Automatically clears the list if user is not authenticated.
     */
    const loadUserResumes = useCallback(async () => {
        if (!isAuthenticated) {
            setUserResumesList([]);
            setIsLoadingUserResumes(false);
            return;
        }
        setIsLoadingUserResumes(true);
        setResumeError(null);
        try {
            // FIXED: Expect the resumes array directly from the API service.
            const resumesList = await apiGetAllResumes();
            setUserResumesList(Array.isArray(resumesList) ? resumesList : []);
        } catch (error) {
            console.error('ResumeContext: Error in loadUserResumes:', error);
            setResumeError(error.message || 'Failed to load your resumes. Please try again.');
            setUserResumesList([]);
        } finally {
            setIsLoadingUserResumes(false);
        }
    }, [isAuthenticated]);

    /**
     * Loads a specific resume for editing
     * @async
     * @function loadResumeForEditor
     * @param {string} resumeId - The ID of the resume to load
     * @returns {Promise<Object|null>} The loaded resume object or null if failed
     * @description Fetches a resume by ID and sets it as the current resume in the editor.
     * Also loads all customization settings (spacing, styles, etc.).
     */
    const loadResumeForEditor = useCallback(async (resumeId) => {
        if (!isAuthenticated || !resumeId) {
            setCurrentResumeDetail(null);
            setEditorFormData({});
            setIsLoadingCurrentResume(false);
            if (!resumeId) {
                setResumeError('No Resume ID provided to load.');
            }
            return null;
        }
        setIsLoadingCurrentResume(true);
        setResumeError(null);
        setCurrentResumeDetail(null);
        setEditorFormData({});
        try {
            const loadedResume = await apiGetById(resumeId);
            
            if (!loadedResume) {
                throw new Error("Resume data could not be loaded.");
            }

            setCurrentResumeDetail(loadedResume);
            setEditorFormData(loadedResume?.resumeData && typeof loadedResume.resumeData === 'object' ? { ...loadedResume.resumeData } : {});
            
            setSpacingMultiplier(loadedResume.spacingMultiplier || 1);
            setSelectedStylePackKey(loadedResume.stylePackKey || null);
            setSectionOrder(loadedResume.sectionOrder || null);
            setSelectedIndustry(loadedResume.selectedIndustry || null);
            setFontSizeMultiplier(loadedResume.fontSizeMultiplier || 1);

            return loadedResume;
        } catch (error) {
            console.error(`ResumeContext: Error in loadResumeForEditor (ID: ${resumeId}):`, error);
            setResumeError(error.message || `Failed to load resume (ID: ${resumeId}). Please try again.`);
            setCurrentResumeDetail(null);
            setEditorFormData({});
            return null;
        } finally {
            setIsLoadingCurrentResume(false);
        }
    }, [isAuthenticated]);

    /**
     * Prepares a new resume for editing based on a template
     * @function prepareNewResumeForEditor
     * @param {Object} template - The template object to base the resume on
     * @returns {void}
     * @description Initializes a new resume in the editor with empty data
     * but associated with a specific template.
     */
    const prepareNewResumeForEditor = useCallback((template) => {
        if (!template || !template._id || !template.templateComponents) {
            console.error('ResumeContext: prepareNewResumeForEditor - Invalid or incomplete template object provided.', template);
            setResumeError('Cannot prepare new resume: essential template information is missing.');
            setCurrentResumeDetail(null);
            setEditorFormData({});
            return;
        }
        setCurrentResumeDetail({
            _id: null,
            userId: userData?._id,
            templateId: template,
            resumeData: {},
            resumeName: `My New ${template.templateName || 'Resume'}`,
        });
        setEditorFormData({});
        setResumeError(null);
        setIsLoadingCurrentResume(false);
    }, [userData]);

    /**
     * Saves or updates the current resume
     * @async
     * @function saveOrUpdateCurrentResume
     * @param {Object} formDataToSave - The form data to save
     * @param {string} newResumeName - Name for the resume
     * @param {number} spacingMultiplier - Layout spacing multiplier
     * @param {Array|null} sectionOrder - Custom section order
     * @param {string|null} stylePackKey - Selected style pack
     * @param {string|null} selectedIndustry - Target industry
     * @param {number} fontSizeMultiplier - Font size multiplier
     * @returns {Promise<Object|null>} The saved resume object or null if failed
     * @description Creates a new resume or updates an existing one. Automatically
     * determines whether to create or update based on presence of resume ID.
     */
    const saveOrUpdateCurrentResume = useCallback(async (formDataToSave, newResumeName, spacingMultiplier, sectionOrder, stylePackKey, selectedIndustry, fontSizeMultiplier) => {
        console.log('[ResumeContext] saveOrUpdateCurrentResume called');
        console.log('[ResumeContext] formDataToSave received:', formDataToSave);
        console.log('[ResumeContext] formDataToSave.content:', formDataToSave?.content);
        console.log('[ResumeContext] formDataToSave.sectionsConfig:', formDataToSave?.sectionsConfig);
        
        if (!isAuthenticated || !currentResumeDetail || !currentResumeDetail.templateId) {
            setResumeError("Cannot save: User not authenticated or essential resume/template details are missing.");
            return null;
        }
        
        const templateIdForAPI = typeof currentResumeDetail.templateId === 'object'
            ? currentResumeDetail.templateId._id
            : currentResumeDetail.templateId;

        if (!templateIdForAPI) {
            setResumeError("Cannot save: Template ID is missing from current resume details.");
            return null;
        }

        setIsSavingResume(true);
        setResumeError(null);

        const payload = {
            templateId: templateIdForAPI,
            resumeData: formDataToSave,
            resumeName: newResumeName || currentResumeDetail.resumeName || `My Resume ${new Date().toLocaleDateString()}`,
            spacingMultiplier: spacingMultiplier,
            fontSizeMultiplier: fontSizeMultiplier,
            sectionOrder: sectionOrder,
            stylePackKey: stylePackKey,
            selectedIndustry: selectedIndustry,
        };
        
        console.log('[ResumeContext] Payload being sent to API:', payload);
        console.log('[ResumeContext] Payload.resumeData:', payload.resumeData);

        try {
            let savedData;
            if (currentResumeDetail._id) {
                savedData = await apiUpdateResume(currentResumeDetail._id, payload);
                setUserResumesList(prevList => prevList.map(res => (res._id === savedData._id ? savedData : res)));
            } else {
                savedData = await apiCreateResume(payload);
                setUserResumesList(prevList => [savedData, ...prevList]);
            }

            if (!savedData) {
                throw new Error("API did not return the saved resume data.");
            }

            setCurrentResumeDetail(savedData);
            setEditorFormData(savedData.resumeData && typeof savedData.resumeData === 'object' ? { ...savedData.resumeData } : {});
            return savedData;
        } catch (error) {
            console.error("ResumeContext: Error in saveOrUpdateCurrentResume: ", error);
            setResumeError(error.message || "Failed to save your resume. Please try again.");
            return null;
        } finally {
            setIsSavingResume(false);
        }
    }, [isAuthenticated, currentResumeDetail]);

    /**
     * Deletes a resume by ID
     * @async
     * @function deleteResumeById
     * @param {string} resumeId - The ID of the resume to delete
     * @returns {Promise<boolean>} True if deletion successful, false otherwise
     * @description Permanently deletes a resume and removes it from the user's list.
     * Also clears current editor data if the deleted resume was being edited.
     */
    const deleteResumeById = useCallback(async (resumeId) => {
        if (!isAuthenticated || !resumeId) {
            setResumeError("cannot delete: user not authenticated or no Resume ID provided.");
            return false;
        }
        setIsDeletingResume(true);
        setResumeError(null);
        try {
            await apiDeleteResume(resumeId);
            setUserResumesList(prevList => prevList.filter(resume => resume._id !== resumeId));
            if (currentResumeDetail && currentResumeDetail._id === resumeId) {
                setCurrentResumeDetail(null);
                setEditorFormData({});
            }
            return true;
        } catch (error) {
            console.error(`ResumeContext: Error in deleteResumeById (ID: ${resumeId}): `, error);
            setResumeError(error.message || `Failed to delete resume (ID: ${resumeId}). Please try again.`);
            return false;
        } finally {
            setIsDeletingResume(false);
        }
    }, [isAuthenticated, currentResumeDetail]);

    /**
     * Clears all editor data and resets to default state
     * @function clearCurrentEditorData
     * @returns {void}
     * @description Resets the editor to a clean state, clearing all resume data
     * and customization settings. Called when navigating away from the editor.
     */
    const clearCurrentEditorData = useCallback(() => {
        setCurrentResumeDetail(null);
        setEditorFormData({});
        setResumeError(null);
        setSpacingMultiplier(1);
        setFontSizeMultiplier(1);
        setSelectedStylePackKey(null);
        setSectionOrder(null);
        setSelectedIndustry(null);
        setResumeSetupData(null);
    }, []);

    /**
     * Saves resume setup wizard data
     * @function saveResumeSetupData
     * @param {Object} setupData - Setup wizard data (target role, industry, etc.)
     * @returns {void}
     * @description Stores data from the resume setup wizard for use in AI content generation.
     */
    const saveResumeSetupData = useCallback((setupData) => {
        setResumeSetupData(setupData);
    }, []);

    const contextValue = {
        userResumesList,
        setUserResumesList,
        isLoadingUserResumes,
        setIsLoadingUserResumes,
        currentResumeDetail,
        setCurrentResumeDetail,
        isLoadingCurrentResume,
        setIsLoadingCurrentResume,
        editorFormData,
        setEditorFormData,
        isSavingResume,
        setIsSavingResume,
        isDeletingResume,
        setIsDeletingResume,
        resumeError,
        spacingMultiplier,
        setSpacingMultiplier,
        fontSizeMultiplier,
        setFontSizeMultiplier,
        selectedStylePackKey,
        setSelectedStylePackKey,
        sectionOrder,
        setSectionOrder,
        selectedIndustry,
        setSelectedIndustry,
        resumeSetupData,
        setResumeSetupData,
        saveResumeSetupData,
        setResumeError,
        loadUserResumes,
        loadResumeForEditor,
        prepareNewResumeForEditor,
        saveOrUpdateCurrentResume,
        deleteResumeById,
        clearCurrentEditorData
    };

    return (
        <ResumeContext.Provider value={contextValue}>
            {children}
        </ResumeContext.Provider>
    );
};

export { ResumeContext, ResumeContextProvider };