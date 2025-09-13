import React, { createContext, useState, useCallback, useContext } from "react";
import useAuthContext from '../hooks/useAuth';
import {
    getAllResumes as apiGetAllResumes,
    getById as apiGetById,
    createResume as apiCreateResume,
    updateResume as apiUpdateResume,
    deleteResume as apiDeleteResume
} from '../api/resumeServiceApi.js';

const ResumeContext = createContext(null);

const ResumeContextProvider = ({ children }) => {
    const { isAuthenticated, userData } = useAuthContext();

    const [userResumesList, setUserResumesList] = useState([]);
    const [isLoadingUserResumes, setIsLoadingUserResumes] = useState(false);
    const [currentResumeDetail, setCurrentResumeDetail] = useState(null);
    const [isLoadingCurrentResume, setIsLoadingCurrentResume] = useState(false);
    const [editorFormData, setEditorFormData] = useState({});
    const [isSavingResume, setIsSavingResume] = useState(false);
    const [isDeletingResume, setIsDeletingResume] = useState(false);
    const [resumeError, setResumeError] = useState(null);

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

    const updateCurrentResumeUISettings = useCallback((newSettings) => {
    if (!currentResumeDetail) return;

    setCurrentResumeDetail(prevDetails => ({
        ...prevDetails,
        ...newSettings,
    }));
    }, [currentResumeDetail]);

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
            spacingMultiplier: 1,
            sectionOrder: template.templateComponents?.sectionPresets?.[0]?.order || null,
            stylePackKey: template.templateComponents?.stylePacks?.[0]?.key || null,
            selectedIndustry: null,
        });
        setEditorFormData({});
        setResumeError(null);
        setIsLoadingCurrentResume(false);
    }, [userData]);

    const saveOrUpdateCurrentResume = useCallback(async (formDataToSave, newResumeName, spacingMultiplier, sectionOrder, stylePackKey, selectedIndustry) => {
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
            sectionOrder: sectionOrder,
            stylePackKey: stylePackKey,
            selectedIndustry: selectedIndustry,
        };

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

    const clearCurrentEditorData = useCallback(() => {
        setCurrentResumeDetail(null);
        setEditorFormData({});
        setResumeError(null);
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
        setResumeError,
        loadUserResumes,
        loadResumeForEditor,
        prepareNewResumeForEditor,
        saveOrUpdateCurrentResume,
        deleteResumeById,
        clearCurrentEditorData,
        updateCurrentResumeUISettings
    };

    return (
        <ResumeContext.Provider value={contextValue}>
            {children}
        </ResumeContext.Provider>
    );
};

export { ResumeContext, ResumeContextProvider };