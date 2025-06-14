import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Save, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { getCoverLetterById, updateCoverLetter } from '@/api/coverLetterServiceApi';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

const CoverLetterEditPage = () => {
    const { coverLetterId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // FIX: Prioritize data passed via state from the preview page.
    // This instantly loads the data without an extra API call.
    const [letterData, setLetterData] = useState(location.state?.letter || null);
    const [content, setContent] = useState(location.state?.letter?.coverLetterContent || '');
    
    // Only show the main loading spinner if we have to fetch the data (e.g., page refresh).
    const [isLoading, setIsLoading] = useState(!location.state?.letter);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // This function now serves as a fallback if the page is accessed directly via URL.
    const fetchLetter = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCoverLetterById(coverLetterId);
            if (data && data.success) {
                setLetterData(data.coverLetter);
                setContent(data.coverLetter.coverLetterContent);
            } else {
                throw new Error(data.message || 'Cover letter not found.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [coverLetterId]);

    // If the component loads without letter data from the state, it will call the API.
    useEffect(() => {
    if (!letterData) {
            fetchLetter();
        }
    }, [letterData, fetchLetter]);

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            await updateCoverLetter(coverLetterId, { coverLetterContent: content });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-[calc(100vh-100px)]"><LoadingSpinner label="Loading Cover Letter..." /></div>;
    }

    if (error) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-10 text-center">
                <Alert variant="destructive" className="max-w-md mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Letter</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button variant="outline" onClick={fetchLetter} className="mt-6">
                    <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
            </div>
        );
    }

    return (
      <>
        <Helmet><title>Edit Cover Letter | CareerForge</title></Helmet>
        <div className="container mx-auto max-w-4xl px-4 py-10">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button variant="outline" size="icon" onClick={() => navigate(`/cover-letter/preview/${coverLetterId}`, { state: { letter: letterData }})} aria-label="Back to Preview">
                <ArrowLeft />
            </Button>
            <div>
                <h1 className="text-3xl font-bold">Edit Cover Letter</h1>
                {letterData && <p className="text-muted-foreground">For: {letterData.jobTitle} at {letterData.companyName}</p>}
            </div>
          </motion.header>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
                <CardContent className="p-6">
                    <label htmlFor="coverLetterContent" className="sr-only">Cover Letter Content</label>
                    <Textarea 
                        id="coverLetterContent"
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        rows={25} 
                        className="text-base leading-relaxed"
                    />
                    {error && <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
                    <Button onClick={handleSave} disabled={isSaving} className="mt-6 w-full sm:w-auto">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : <><Save className="mr-2 h-4 w-4"/> Save Changes</>}
                    </Button>
                </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
};

export default CoverLetterEditPage;
