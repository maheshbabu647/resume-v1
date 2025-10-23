/**
 * @fileoverview Resume Editor State Hook - Centralized state management for the editor
 * @module hooks/useResumeEditorState
 * @description Custom hook that consolidates all state, refs, and context needed by the
 * Resume Editor page. Provides a single source of truth for editor state management.
 */

import { useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAuthContext from "@/hooks/useAuth";
import useTemplateContext from "@/hooks/useTemplate";
import useResumeContext from "@/hooks/useResume";

/**
 * Custom hook for managing Resume Editor state
 * @hook
 * @function useResumeEditorState
 * @returns {Object} Complete editor state object
 * @returns {string} return.newResumeTemplateId - Template ID for new resume (from URL params)
 * @returns {string} return.existingResumeId - Resume ID for editing (from URL params)
 * @returns {Function} return.navigate - React Router navigate function
 * @returns {Object} return.location - React Router location object
 * @returns {React.RefObject} return.resumePreviewRef - Ref to preview component
 * @returns {React.RefObject} return.nameInputRef - Ref to name input element
 * @returns {Object} return.auth - Authentication context
 * @returns {Object} return.templates - Template context
 * @returns {Object} return.resume - Resume context
 * @returns {string|null} return.mode - Editor mode ('create' or 'edit')
 * @returns {boolean} return.pageIsLoading - Overall page loading state
 * @returns {string|null} return.pageError - Page-level error message
 * @returns {Object|null} return.currentTemplateForEditor - Current template being used
 * @returns {string} return.editableResumeName - Current resume name
 * @returns {boolean} return.isEditingName - Whether name is being edited
 * @returns {boolean} return.isDownloadingPdf - PDF download state
 * @returns {boolean} return.showFeedbackDialog - Feedback dialog visibility
 * @returns {Object} return.feedbackDetailsForDialog - Feedback dialog content
 * @returns {boolean} return.showAuthDialog - Auth dialog visibility
 * @returns {boolean} return.isDirty - Whether form has unsaved changes
 * @returns {string} return.saveStatus - Current save status ('idle'|'saving'|'saved')
 * @returns {boolean} return.showPlaceholderWarning - Placeholder warning dialog visibility
 * @returns {string|null} return.pendingAction - Pending action ('save'|'download')
 * @returns {boolean} return.isAddSectionDialogOpen - Add section dialog visibility
 * @returns {string} return.activeMobileView - Active mobile view ('edit'|'preview')
 * @returns {boolean} return.isCustomizeDialogOpen - Customize dialog visibility
 * @returns {Set} return.editedSections - Set of edited section keys
 * @returns {number} return.spacingMultiplier - Layout spacing multiplier
 * @returns {number} return.fontSizeMultiplier - Font size multiplier
 * @returns {string|null} return.selectedStylePackKey - Selected style pack
 * @returns {Array|null} return.sectionOrder - Custom section order
 * @returns {string|null} return.selectedPresetKey - Selected preset
 * @returns {string|null} return.selectedIndustry - Target industry
 * @returns {number} return.zoomLevel - Preview zoom level
 * @returns {number} return.previewUpdateKey - Key to force preview updates
 * @returns {boolean} return.isTooltipDialogOpen - Tooltip dialog visibility
 * @returns {Object} return.tooltipContent - Tooltip content
 * @returns {boolean} return.showResumeSetupDialog - Setup dialog visibility
 * @description This hook centralizes all state management for the Resume Editor page,
 * including router state, UI state, customization settings, and context integration.
 * It reduces prop drilling and provides a clean interface for the editor component.
 * @example
 * const editorState = useResumeEditorState();
 * const { mode, isLoadingPage, currentTemplateForEditor } = editorState;
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