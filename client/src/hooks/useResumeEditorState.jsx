import { useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAuthContext from "@/hooks/useAuth";
import useTemplateContext from "@/hooks/useTemplate";
import useResumeContext from "@/hooks/useResume";

/**
 * Manages all state, refs, and context for the ResumeEditorPage.
 */
export const useResumeEditorState = () => {
    // Router Hooks
    const { newResumeTemplateId, existingResumeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Refs
    const resumePreviewRef = useRef(null);
    const nameInputRef = useRef(null);

    // Context Consumers
    const auth = useAuthContext();
    const templates = useTemplateContext();
    const resume = useResumeContext();

    // Component-Specific State
    const [mode, setMode] = useState(null);
    const [pageIsLoading, setPageIsLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const [currentTemplateForEditor, setCurrentTemplateForEditor] = useState(null);
    const [editableResumeName, setEditableResumeName] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [feedbackDetailsForDialog, setFeedbackDetailsForDialog] = useState({ title: '', message: '', type: 'success' });
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle');
    const [showPlaceholderWarning, setShowPlaceholderWarning] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);
    const [activeMobileView, setActiveMobileView] = useState('edit');
    const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
    const [editedSections, setEditedSections] = useState(new Set());
    const [spacingMultiplier, setSpacingMultiplier] = useState(1);
    const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
    const [selectedStylePackKey, setSelectedStylePackKey] = useState(null);
    const [sectionOrder, setSectionOrder] = useState(null);
    const [selectedPresetKey, setSelectedPresetKey] = useState(null);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [previewUpdateKey, setPreviewUpdateKey] = useState(0);
    const [isTooltipDialogOpen, setIsTooltipDialogOpen] = useState(false)
    const [tooltipContent, setTooltipContent] = useState({ title: '', message: '' })
    const [showResumeSetupDialog, setShowResumeSetupDialog] = useState(false)

    return {
        // Router & Refs
        newResumeTemplateId, existingResumeId, navigate, location,
        resumePreviewRef, nameInputRef,
        // Contexts
        auth, templates, resume,
        // State & Setters
        mode, setMode,
        pageIsLoading, setPageIsLoading,
        pageError, setPageError,
        currentTemplateForEditor, setCurrentTemplateForEditor,
        editableResumeName, setEditableResumeName,
        isEditingName, setIsEditingName,
        isDownloadingPdf, setIsDownloadingPdf,
        showFeedbackDialog, setShowFeedbackDialog,
        feedbackDetailsForDialog, setFeedbackDetailsForDialog,
        showAuthDialog, setShowAuthDialog,
        isDirty, setIsDirty,
        saveStatus, setSaveStatus,
        showPlaceholderWarning, setShowPlaceholderWarning,
        pendingAction, setPendingAction,
        isAddSectionDialogOpen, setIsAddSectionDialogOpen,
        activeMobileView, setActiveMobileView,
        isCustomizeDialogOpen, setIsCustomizeDialogOpen,
        editedSections, setEditedSections,
        spacingMultiplier, setSpacingMultiplier,
        fontSizeMultiplier, setFontSizeMultiplier,
        selectedStylePackKey, setSelectedStylePackKey,
        sectionOrder, setSectionOrder,
        selectedPresetKey, setSelectedPresetKey,
        selectedIndustry, setSelectedIndustry,
        zoomLevel, setZoomLevel,
        previewUpdateKey, setPreviewUpdateKey,
        isTooltipDialogOpen, setIsTooltipDialogOpen,
        tooltipContent, setTooltipContent,
        showResumeSetupDialog, setShowResumeSetupDialog,
    };
};