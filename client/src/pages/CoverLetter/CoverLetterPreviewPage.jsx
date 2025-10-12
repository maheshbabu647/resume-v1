import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Edit, Download, Clipboard, Check, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { getCoverLetterById } from '@/api/coverLetterServiceApi'; // Assuming this API function exists
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

const CoverLetterPreviewPage = () => {
    const { coverLetterId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // The component can receive the letter data via state for immediate display,
    // or fetch it using the ID if accessed directly.
    const [letter, setLetter] = useState(location.state?.letter || null);
    const [isLoading, setIsLoading] = useState(!location.state?.letter);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const fetchLetter = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCoverLetterById(coverLetterId);
            if (data && data.success) {
                setLetter(data.coverLetter);
            } else {
                throw new Error(data.message || 'Cover letter not found.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [coverLetterId]);

    useEffect(() => {
        if (!letter) {
            fetchLetter();
        }
    }, [letter, fetchLetter]);

    const handleEdit = () => {
        navigate(`/cover-letter/edit/${coverLetterId}`, { state: { letter } });
    };
    
    const handleCopy = () => {
        if (!letter?.coverLetterContent) return;
        navigator.clipboard.writeText(letter.coverLetterContent).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = letter.coverLetterContent;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                 alert('Failed to copy text.');
            }
            document.body.removeChild(textArea);
        });
    };
    
    const handleDownload = () => {
        // This is a placeholder for a more advanced download feature (e.g., PDF)
        const blob = new Blob([letter.coverLetterContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${letter.companyName} - ${letter.jobTitle} - Cover Letter.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
    
    if (!letter) {
        return null; // Or a more specific 'not found' component
    }

    return (
        <>
            <Helmet><title>View Cover Letter | CareerForge</title></Helmet>
            <div className="container mx-auto max-w-4xl px-4 py-10">
                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8"
                >
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')} aria-label="Back to Dashboard">
                            <ArrowLeft />
                        </Button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Cover Letter</h1>
                            <p className="text-muted-foreground">For: {letter.jobTitle} at {letter.companyName}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                        <Button variant="outline" onClick={handleEdit}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                        <Button variant="outline" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download</Button>
                    </div>
                </motion.header>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="shadow-lg">
                        <CardContent className="p-6 sm:p-8 relative">
                            <Button variant="ghost" size="sm" onClick={handleCopy} className="absolute top-4 right-4 text-muted-foreground hover:bg-muted/50">
                                {isCopied ? <Check className="h-4 w-4 text-green-500"/> : <Clipboard className="h-4 w-4"/>}
                                <span className="sr-only">Copy content</span>
                            </Button>
                            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert whitespace-pre-wrap font-serif">
                                {letter.coverLetterContent}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
};

export default CoverLetterPreviewPage;
