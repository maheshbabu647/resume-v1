import { downloadResume as apiDownloadResume, enhanceResumeField } from "@/api/resumeServiceApi";

export async function handleSaveResume({
  editorFormData,
  editableResumeName,
  spacingMultiplier,
  fontSizeMultiplier,
  sectionOrder,
  selectedStylePackKey,
  selectedIndustry,
  isAuthenticated,
  saveOrUpdateCurrentResume,
  setIsDirty,
  setSaveStatus,
  setFeedbackDetailsForDialog,
  setShowFeedbackDialog,
  mode,
  navigate,
  newResumeTemplateId,
  setPageError,
}) {
  if (!isAuthenticated) {
    // trigger auth flow
    return false;
  }

  setSaveStatus("saving");
  try {
    const savedResult = await saveOrUpdateCurrentResume(
      editorFormData,
      editableResumeName.trim(),
      spacingMultiplier,
      sectionOrder,
      selectedStylePackKey,
      selectedIndustry,
      fontSizeMultiplier
    );
    if (savedResult?.id) {
      setFeedbackDetailsForDialog({
        title: "Success!",
        message: "Resume saved successfully!",
        type: "success",
      });
      setShowFeedbackDialog(true);
      setIsDirty(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
      if (mode === "create") {
        navigate(`/resumeedit/${savedResult.id}`, { replace: true });
      }
    }
  } catch (error) {
    setPageError("Failed to save resume.");
  }
}

export async function handleDownloadPdf({
  resumePreviewRef,
  isAuthenticated,
  setIsDownloadingPdf,
  apiDownloadResume,
  setPageError,
}) {
  if (!isAuthenticated) {
    // trigger auth flow
    return false;
  }

  if (!resumePreviewRef.current) {
    return;
  }

  setIsDownloadingPdf(true);
  try {
    const previewElement = resumePreviewRef.current;
    const styleElement = previewElement.querySelector("style");
    const resumeContainer = previewElement.querySelector(".rt-container");
    if (!styleElement || !resumeContainer) {
      throw new Error("Could not find style or resume content for PDF generation.");
    }
    const cleanHtmlForPdf = styleElement.outerHTML + resumeContainer.outerHTML;
    await apiDownloadResume(cleanHtmlForPdf);
  } catch (e) {
    setPageError("Failed to download PDF.");
  } finally {
    setIsDownloadingPdf(false);
  }
}

export async function handleEnhanceField({ fieldPath, textToEnhance, jobContext, enhanceResumeField, setEnhancementSuggestions, setShowFeedbackDialog }) {
  if (!textToEnhance || !textToEnhance.trim()) {
    setShowFeedbackDialog({
      title: "Cannot Enhance",
      message: "Please enter some text before using AI enhancement.",
      type: "error",
    });
    return;
  }

  try {
    const suggestions = await enhanceResumeField(textToEnhance, jobContext);
    setEnhancementSuggestions(suggestions);
  } catch (error) {
    setShowFeedbackDialog({
      title: "AI Enhancement Failed",
      message: error.message,
      type: "error",
    });
  }
}
