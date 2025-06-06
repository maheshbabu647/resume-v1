import React, { useEffect, Suspense, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Plus, AlertCircle, RefreshCw, FileText as FileTextIcon, Trash2, CheckCircle2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
const ResumeCard = React.lazy(() => import('@/components/Resume/ResumeCard'));
import useResumeContext from '@/hooks/useResume';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ResumePage = () => {
  const {
    userResumesList = [],
    isLoadingUserResumes,
    resumeError,
    loadUserResumes,
    deleteResumeById,
  } = useResumeContext();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [deleteFeedback, setDeleteFeedback] = useState(null);

  useEffect(() => {
    loadUserResumes();
  }, [loadUserResumes]);

  useEffect(() => {
    if (deleteFeedback) {
      const timer = setTimeout(() => setDeleteFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [deleteFeedback]);

  const handleDeleteResume = (resumeId, resumeName) => {
    setResumeToDelete({ _id: resumeId, resumeName });
    setShowDeleteConfirmDialog(true);
    setDeleteFeedback(null);
  };

  const confirmDeleteResume = async () => {
    if (!resumeToDelete) return;
    const success = await deleteResumeById(resumeToDelete._id);
    if (success) {
      setDeleteFeedback({ message: `Resume "${resumeToDelete.resumeName}" deleted successfully.`, type: 'success' });
      loadUserResumes();
    } else {
      setDeleteFeedback({ message: resumeError?.message || `Failed to delete "${resumeToDelete.resumeName}".`, type: 'error' });
    }
    setShowDeleteConfirmDialog(false);
    setResumeToDelete(null);
  };

  const handleCreateNew = () => navigate('/templates');
  const handleRetryLoad = () => loadUserResumes();

  const filteredResumes = userResumesList.filter(resume =>
    (resume.resumeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resume.templateId?.templateName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
  const listVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 }}};
  const itemVariants = { hidden: { opacity: 0, y: 15, scale: 0.99 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" }}};

  return (
    <>
      <Helmet>
        <title>My Resumes | CareerForge Dashboard</title>
        <meta name="description" content="Manage, create, and edit your professional resumes. Access all your saved documents and continue your job application journey with CareerForge." />
      </Helmet>

      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.4, ease: "easeInOut" }} className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16" aria-label="User Resumes Dashboard">
          <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col sm:flex-row justify-between items-center mb-10 md:mb-14 gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">My Resumes</h1>
              <p className="text-muted-foreground mt-1.5 text-base sm:text-lg">View, edit, and manage all your saved resumes with ease.</p>
            </div>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out px-6 py-3 self-start sm:self-center" onClick={handleCreateNew} aria-label="Create New Resume">
              <Plus size={22} className="mr-2.5" /> Create New Resume
            </Button>
          </motion.header>

          {deleteFeedback && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <Alert variant={deleteFeedback.type === 'error' ? 'destructive' : 'default'} 
                     className={cn(deleteFeedback.type === 'success' ? 'bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-300 [&>svg]:text-green-600 dark:[&>svg]:text-green-400' : '', 'shadow-md rounded-lg')}>
                {deleteFeedback.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <AlertTitle className="font-semibold">{deleteFeedback.type === 'success' ? 'Success!' : 'Operation Failed'}</AlertTitle>
                <AlertDescription>{deleteFeedback.message}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-8 md:mb-12 p-4 sm:p-6 bg-card border border-border rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <Tabs defaultValue="resumes" className="w-full md:w-auto">
                <TabsList className="bg-muted p-1.5 rounded-lg shadow-inner">
                  <TabsTrigger value="resumes" className="px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-accent/50 rounded-md">Resumes</TabsTrigger>
                  <TabsTrigger value="cover-letters" disabled className="px-4 py-2 text-sm disabled:opacity-50">Cover Letters</TabsTrigger>
                  <TabsTrigger value="interviews" disabled className="px-4 py-2 text-sm disabled:opacity-50">Interviews</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
                <Input type="text" placeholder="Search by name or template..." className="pl-11 w-full bg-background border-input focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Search your resumes" />
              </div>
            </div>
          </motion.div>

          {isLoadingUserResumes ? (
            <div className="flex flex-col justify-center items-center py-24 text-center" aria-busy="true" aria-live="polite">
              <LoadingSpinner size="xlarge" label="Loading your resumes..." colorClassName="text-primary" />
              <p className="mt-4 text-muted-foreground">Fetching your documents...</p>
            </div>
          ) : resumeError && !deleteFeedback ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center" role="alert">
              <Alert variant="destructive" className="max-w-md w-full mb-6 shadow-lg rounded-lg">
                <AlertCircle className="h-6 w-6" />
                <AlertTitle className="text-lg font-semibold">Failed to Load Resumes</AlertTitle>
                <AlertDescription className="mt-1">{typeof resumeError === 'string' ? resumeError : resumeError.message || "We couldn't retrieve your resumes. Please check your connection or try again."}</AlertDescription>
              </Alert>
              <Button onClick={handleRetryLoad} variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <RefreshCw className="mr-2 h-5 w-5" /> Try Again
              </Button>
            </motion.div>
          ) : filteredResumes.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 flex flex-col items-center">
              <FileTextIcon className="h-20 w-20 text-muted-foreground/70 mb-8" strokeWidth={1} />
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                {searchTerm ? "No Resumes Match Your Search" : "Your Resume Dashboard is Empty"}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md text-base sm:text-lg">
                {searchTerm ? "Try different keywords or clear your search to see all your resumes." : "It looks like you haven't created any resumes yet. Let's build your first professional resume!"}
              </p>
              {!searchTerm && (<Button size="lg" onClick={handleCreateNew} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all px-8 py-3 text-base"><Plus size={22} className="mr-2.5" /> Create Your First Resume</Button>)}
            </motion.div>
          ) : (
            <motion.section variants={listVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8" aria-label="Your Saved Resumes">
              <Suspense fallback={ Array.from({ length: Math.min(filteredResumes.length, 8) }).map((_, i) => (
                  <motion.div key={`skeleton-${i}`} variants={itemVariants} className="bg-card p-4 rounded-xl border border-border shadow-lg animate-pulse h-full">
                    <div className="aspect-w-16 aspect-h-9 bg-muted rounded-md mb-4"></div>
                    <div className="h-5 bg-muted rounded w-3/4 mb-2.5"></div>
                    <div className="h-4 bg-muted rounded w-full mb-1.5"></div>
                    <div className="h-4 bg-muted rounded w-2/3 mb-5"></div>
                    <div className="flex justify-between gap-2 mt-auto">
                        <div className="h-9 bg-muted/50 rounded w-1/3"></div>
                        <div className="h-9 bg-muted/50 rounded w-1/3"></div>
                        <div className="h-9 bg-muted/50 rounded w-1/3"></div>
                    </div>
                  </motion.div>
                ))}>
                {filteredResumes.map((resume) => (
                  <motion.div key={resume._id} variants={itemVariants} className="h-full">
                    <ResumeCard resume={resume} onDelete={() => handleDeleteResume(resume._id, resume.resumeName)} />
                  </motion.div>
                ))}
              </Suspense>
            </motion.section>
          )}
        </main>

        <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
          <DialogContent className="sm:max-w-md bg-card">
            <DialogHeader><DialogTitle className="flex items-center text-lg font-semibold text-foreground"><Trash2 className="h-5 w-5 mr-2 text-destructive" />Confirm Deletion</DialogTitle></DialogHeader>
            <DialogDescription className="py-4 text-muted-foreground">Are you sure you want to delete the resume titled "<strong>{resumeToDelete?.resumeName || 'this resume'}</strong>"? This action cannot be undone.</DialogDescription>
            <DialogFooter className="sm:justify-end gap-2 pt-2">
              <DialogClose asChild><Button type="button" variant="outline" className="border-border">Cancel</Button></DialogClose>
              <Button type="button" variant="destructive" onClick={confirmDeleteResume} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </>
  );
};

export default ResumePage;
