import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Download, Printer } from 'lucide-react';
import { getById as apiGetResumeById } from '@/api/resumeServiceApi';
import { getTemplateById as apiGetTemplateById } from '@/api/templateServiceApi';
import { downloadResume as apiDownloadResume } from "@/api/resumeServiceApi";
import generateResumeHtml from '@/utils/generateResumeHtml';
import { Loader2 } from "lucide-react";

// Lazy load ResumePreview
const ResumePreview = React.lazy(() => import('@/components/Resume/ResumePreview'));

const ResumeViewerPage = () => {
  const { resumeId, templateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Use location to get state
  const resumePreviewRef = useRef();

  const [displayData, setDisplayData] = useState({
    templateCode: null,
    formData: null,
    resumeName: 'Resume',
    spacingMultiplier: 1,
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setPageLoading(true);
    setPageError(null);

    const loadData = async () => {
      try {
        let finalTemplateCode, finalFormData, finalResumeName, finalSpacingMultiplier;

        if (resumeId) {
          // --- Viewing a SAVED resume ---
          const savedResume = await apiGetResumeById(resumeId);
          if (!savedResume || !savedResume.templateId) {
            throw new Error('Resume data or associated template is missing.');
          }
          finalTemplateCode = savedResume.templateId.templateCode;
          finalFormData = savedResume.resumeData;
          finalResumeName = savedResume.resumeName || 'Untitled Resume';
          finalSpacingMultiplier = savedResume.spacingMultiplier || 1; 
        } else if (templateId) {
          // --- Previewing a NEW resume ---
          const template = await apiGetTemplateById(templateId);
          if (!template) {
            throw new Error(`Template with ID ${templateId} not found.`);
          }
          
          finalTemplateCode = template.templateCode;
          // *** FIX: Use data from location state if available, otherwise use empty object ***
          finalFormData = location.state?.formData || {}; 
          finalResumeName = location.state?.resumeName || `${template.templateName || 'Template'} Preview`;
          finalSpacingMultiplier = location.state?.spacingMultiplier || 1;
        } else {
          throw new Error('No resume or template specified for viewing.');
        }

        if (isMounted) {
          setDisplayData({
            templateCode: finalTemplateCode,
            formData: finalFormData,
            resumeName: finalResumeName,
            spacingMultiplier: finalSpacingMultiplier,
          });
        }
      } catch (err) {
        if (isMounted) {
          setPageError(err.message || 'Failed to load resume information.');
          console.error("ResumeViewerPage Error:", err);
        }
      } finally {
        if (isMounted) {
          setPageLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [resumeId, templateId, location.state]); // Add location.state to dependency array

  const handleDownload = async () => {
    if (!resumePreviewRef.current) return;
    setIsDownloading(true);
    try {
      const htmlContent = resumePreviewRef.current.innerHTML;
      await apiDownloadResume(htmlContent);
    } catch (error) {
      alert('Failed to download PDF.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <LoadingSpinner size="large" label="Loading Resume..." />
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
        <Alert variant="destructive" className="max-w-lg w-full">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error Loading Resume</AlertTitle>
          <AlertDescription>{pageError}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }
  
  const pageTitle = `${displayData.resumeName} | CareerForge Viewer`;
  
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`View your resume: ${displayData.resumeName}.`} />
      </Helmet>

      <div className="min-h-screen bg-muted/50 text-foreground flex flex-col items-center print:bg-white">
        <header className="w-full bg-card/80 backdrop-blur-md shadow-sm sticky top-0 z-10 p-3 print:hidden">
          <div className="container mx-auto flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-primary">
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handlePrint} className="border-border hover:bg-accent hover:text-accent-foreground">
                    <Printer size={16} className="mr-2" /> Print
                </Button>
                <Button onClick={handleDownload} disabled={isDownloading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {isDownloading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Download size={16} className="mr-2" />}
                {isDownloading ? 'Downloading...' : 'Download PDF'}
                </Button>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full py-6 md:py-8 flex justify-center print:py-0" aria-label="Resume Document View">
           <Suspense fallback={
            <div className="flex items-center justify-center h-[calc(100vh-150px)]">
                <LoadingSpinner size="large" label="Loading Preview..." />
            </div>
            }>
            <ResumePreview
              ref={resumePreviewRef}
              templateCode={displayData.templateCode}
              currentFormData={displayData.formData}
              spacingMultiplier={displayData.spacingMultiplier}
            />
          </Suspense>
        </main>
      </div>
    </>
  );
};

export default ResumeViewerPage;
