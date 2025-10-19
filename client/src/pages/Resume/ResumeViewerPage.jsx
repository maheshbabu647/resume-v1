import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Download, Printer, Loader2 } from 'lucide-react';
import { getById as apiGetResumeById } from '@/api/resumeServiceApi';
import { downloadResume as apiDownloadResume } from "@/api/resumeServiceApi";

// Lazy load ResumePreview as it's a large component
const ResumePreview = React.lazy(() => import('@/components/ResumeEditor/ResumePreview'));

const ResumeViewerPage = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const resumePreviewRef = useRef();

  // State to hold all the pieces needed to build the resume
  const [resumeData, setResumeData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadResumeData = async () => {
      setPageLoading(true);
      try {
        let data;
        if (location.state?.template) {
          // --- SCENARIO 1: Previewing a NEW, unsaved resume from the editor ---
          // All data is passed directly via location.state, no API call needed.
          data = {
            formData: location.state.formData,
            resumeName: location.state.resumeName,
            spacingMultiplier: location.state.spacingMultiplier,
            fontSizeMultiplier: location.state.fontSizeMultiplier,
            sectionOrder: location.state.sectionOrder,
            stylePackKey: location.state.stylePackKey,
            templateComponents: location.state.template.templateComponents,
            templateFieldDefinition: location.state.template.templateFieldDefinition,
          };
        } else if (resumeId) {
          // --- SCENARIO 2: Viewing a SAVED resume from the dashboard ---
          const savedResume = await apiGetResumeById(resumeId);
          if (!savedResume || !savedResume.templateId?.templateComponents) {
            throw new Error('Could not load the saved resume. The template data may be incomplete.');
          }
          data = {
            formData: savedResume.resumeData,
            resumeName: savedResume.resumeName,
            spacingMultiplier: savedResume.spacingMultiplier,
            fontSizeMultiplier: savedResume.fontSizeMultiplier,
            sectionOrder: savedResume.sectionOrder,
            stylePackKey: savedResume.stylePackKey,
            templateComponents: savedResume.templateId.templateComponents,
            templateFieldDefinition: savedResume.templateId.templateFieldDefinition,
          };
        } else {
          throw new Error('No resume information was provided.');
        }
        setResumeData(data);
      } catch (err) {
        console.error("ResumeViewerPage Error:", err);
        setPageError(err.message || 'An unexpected error occurred.');
      } finally {
        setPageLoading(false);
      }
    };

    loadResumeData();
  }, [resumeId, location.state]);

  const handleDownload = async () => {
    if (!resumePreviewRef.current) return;
    setIsDownloading(true);
    try {
      // This improved logic correctly grabs the style and content for a clean PDF
      const previewElement = resumePreviewRef.current;
      const styleElement = previewElement.querySelector('style');
      const resumeContainer = previewElement.querySelector('.rt-container');

      if (!styleElement || !resumeContainer) {
        throw new Error("Could not find style or resume content for PDF generation.");
      }
      const cleanHtmlForPdf = styleElement.outerHTML + resumeContainer.outerHTML;
      await apiDownloadResume(cleanHtmlForPdf);
    } catch (error) {
      console.error("Download error:", error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" label="Loading Resume..." />
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Alert variant="destructive" className="max-w-lg w-full">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error Loading Resume</AlertTitle>
          <AlertDescription>{pageError}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }
  
  const pageTitle = `${resumeData.resumeName || 'Resume'} | CareerForge Viewer`;
  
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <div className="min-h-screen bg-muted/50 flex flex-col items-center print:bg-white">
        <header className="w-full bg-card/80 backdrop-blur-md shadow-sm sticky top-0 z-10 p-3 print:hidden">
          <div className="container mx-auto flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
                <Button onClick={handleDownload} disabled={isDownloading}>
                {isDownloading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Download size={16} className="mr-2" />}
                {isDownloading ? 'Downloading...' : 'Download PDF'}
                </Button>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full py-6 md:py-8 flex justify-center print:py-0">
           <Suspense fallback={
            <div className="flex items-center justify-center h-[calc(100vh-150px)]">
                <LoadingSpinner size="large" label="Loading Preview..." />
            </div>
            }>
            {/* Pass all the modular pieces to the ResumePreview component */}
            <ResumePreview
              ref={resumePreviewRef}
              htmlShell={resumeData.templateComponents.htmlShell}
              baseCss={resumeData.templateComponents.baseCss}
              sections={resumeData.templateComponents.sections}
              stylePacks={resumeData.templateComponents.stylePacks}
              selectedStylePackKey={resumeData.stylePackKey}
              sectionOrder={resumeData.sectionOrder}
              currentFormData={resumeData.formData}
              spacingMultiplier={resumeData.spacingMultiplier}
              fontSizeMultiplier={resumeData.fontSizeMultiplier}
              editedSections={new Set(Object.keys(resumeData.formData?.sectionsConfig || {}))}
              templateFieldDefinition={resumeData.templateFieldDefinition}
            />
          </Suspense>
        </main>
      </div>
    </>
  );
};

export default ResumeViewerPage;