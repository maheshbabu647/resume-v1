import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Plus, FileText, Trash2, Edit, AlertCircle, RefreshCw } from 'lucide-react';

// Import hooks and components for both Resumes and Cover Letters
import useResumeContext from '../hooks/useResume';
import { useCoverLetterContext } from '@/context/CoverLetterContext';
import ResumeCard from '../components/Resume/ResumeCard';
const CoverLetterCard = React.lazy(() => import('../components/CoverLetter/CoverLetterCard'));
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('resumes');
    
    // Resume specific state and functions
    const { userResumesList, loadUserResumes, deleteResumeById, isLoadingUserResumes, resumeError } = useResumeContext();
    
    // Cover Letter specific state and functions
    const { coverLetters, fetchCoverLetters, deleteCoverLetterById, isLoading: isLoadingCoverLetters, error: coverLetterError } = useCoverLetterContext();

    useEffect(() => {
        // Fetch data based on the active tab to optimize loading
        if (activeTab === 'resumes') {
            loadUserResumes();
        } else if (activeTab === 'cover-letters') {
            fetchCoverLetters();
        }
    }, [activeTab, loadUserResumes, fetchCoverLetters]);

    const handleDeleteResume = async (resumeId) => {
        if (window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
            await deleteResumeById(resumeId);
        }
    };
    
    const handleDeleteCoverLetter = async (letterId) => {
        if (window.confirm('Are you sure you want to delete this cover letter?')) {
            await deleteCoverLetterById(letterId);
            // Optionally re-fetch to ensure list is up to date
            fetchCoverLetters();
        }
    };

    const handleCreateNew = () => {
        if (activeTab === 'resumes') {
            navigate('/templates');
        } else {
            navigate('/cover-letter/generate');
        }
    };

    return (
        <>
            <Helmet>
                <title>Dashboard | CareerForge</title>
                <meta name="description" content="Manage your resumes and cover letters." />
            </Helmet>
            <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary tracking-tight">Dashboard</h1>
                        <p className="mt-1 text-muted-foreground">Manage all your career documents in one place.</p>
                    </div>
                    <Button onClick={handleCreateNew}>
                        <Plus className="mr-2 h-4 w-4" /> 
                        {activeTab === 'resumes' ? 'Create New Resume' : 'Create New Cover Letter'}
                    </Button>
                </header>

                <Tabs defaultValue="resumes" onValueChange={setActiveTab} className="w-full">
                    {/* FIX: Reverted to the smaller, inline tab style */}
                    <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                        <TabsTrigger value="resumes">My Resumes</TabsTrigger>
                        <TabsTrigger value="cover-letters">My Cover Letters</TabsTrigger>
                    </TabsList>

                    <TabsContent value="resumes" className="mt-6">
                        {isLoadingUserResumes ? (
                            <div className="flex justify-center py-20"><LoadingSpinner label="Loading Resumes..." /></div>
                        ) : resumeError ? (
                            <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{resumeError}</AlertDescription></Alert>
                        ) : userResumesList.length > 0 ? (
                            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <AnimatePresence>
                                    {userResumesList.map(resume => <ResumeCard key={resume._id} resume={resume} onDelete={() => handleDeleteResume(resume._id)} />)}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                           <div className="text-center py-20 border-2 border-dashed rounded-lg">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-medium">No Resumes Found</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first resume.</p>
                                <Button className="mt-6" onClick={() => navigate('/templates')}><Plus className="mr-2 h-4 w-4" /> Create Resume</Button>
                           </div>
                        )}
                    </TabsContent>

                    <TabsContent value="cover-letters" className="mt-6">
                        {isLoadingCoverLetters ? (
                            <div className="flex justify-center py-20"><LoadingSpinner label="Loading Cover Letters..." /></div>
                        ) : coverLetterError ? (
                            <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{coverLetterError}</AlertDescription></Alert>
                        ) : coverLetters.length > 0 ? (
                            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <AnimatePresence>
                                    {coverLetters.map(letter => (
                                        <Suspense key={letter._id} fallback={<div className="h-48 bg-muted rounded-lg animate-pulse" />}>
                                            <CoverLetterCard letter={letter} onDelete={() => handleDeleteCoverLetter(letter._id)} />
                                        </Suspense>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-medium">No Cover Letters Found</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Get started by generating your first cover letter.</p>
                                <Button className="mt-6" onClick={() => navigate('/cover-letter/generate')}><Plus className="mr-2 h-4 w-4" /> Generate New</Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default DashboardPage;

