import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertCircle, RefreshCw, LayoutGrid, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import AdminTemplateCard from '@/components/Template/AdminTemplateCard'; // New component for admin
import { getAllTemplates as apiGetAllTemplates, deleteTemplate as apiDeleteTemplate } from '@/api/templateServiceApi';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AdminTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deleteFeedback, setDeleteFeedback] = useState(null);
  const navigate = useNavigate();

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiGetAllTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load templates.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    if (deleteFeedback) {
      const timer = setTimeout(() => setDeleteFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [deleteFeedback]);

  const handleDeleteClick = (templateId, templateName) => {
    setTemplateToDelete({ _id: templateId, templateName });
    setShowDeleteConfirm(true);
    setDeleteFeedback(null);
  };

  const confirmDelete = async () => {
    if (!templateToDelete) return;
    try {
      await apiDeleteTemplate(templateToDelete._id);
      setTemplates(prev => prev.filter(t => t._id !== templateToDelete._id));
      setDeleteFeedback({ message: `Template "${templateToDelete.templateName}" deleted successfully.`, type: 'success' });
    } catch (err) {
      setDeleteFeedback({ message: err.message || `Failed to delete "${templateToDelete.templateName}".`, type: 'error' });
    } finally {
      setShowDeleteConfirm(false);
      setTemplateToDelete(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin: Manage Templates | CareerForge</title>
      </Helmet>
      <div className="max-w-full">
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-10 gap-4"
        >
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-8 w-8 text-primary" strokeWidth={2}/>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Template Management</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Create, view, edit, and delete resume templates.</p>
            </div>
          </div>
          <Button size="lg" onClick={() => navigate('/admin/templates/new')} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
            <Plus size={20} className="mr-2.5" /> Add New Template
          </Button>
        </motion.header>

        {deleteFeedback && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert variant={deleteFeedback.type === 'error' ? 'destructive' : 'default'} className={cn(deleteFeedback.type === 'success' && 'bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-300 [&>svg]:text-green-600 dark:[&>svg]:text-green-400', 'shadow-sm rounded-lg')}>
                {deleteFeedback.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <AlertTitle className="font-semibold">{deleteFeedback.type === 'success' ? 'Success!' : 'Error'}</AlertTitle>
                <AlertDescription>{deleteFeedback.message}</AlertDescription>
              </Alert>
            </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-24"><LoadingSpinner size="xlarge" label="Loading templates..." /></div>
        ) : error ? (
          <div className="text-center py-24">
            <Alert variant="destructive" className="max-w-md mx-auto mb-6"><AlertCircle className="h-5 w-5" /><AlertTitle>Failed to Load Templates</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
            <Button onClick={fetchTemplates} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-xl">
            <LayoutGrid className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground">No Templates Found</h3>
            <p className="text-muted-foreground mt-2 mb-6">Get started by adding your first resume template.</p>
            <Button size="lg" onClick={() => navigate('/admin/templates/new')}><Plus size={20} className="mr-2" /> Add New Template</Button>
          </div>
        ) : (
          <motion.section 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            <AnimatePresence>
                {templates.map(template => (
                    <AdminTemplateCard key={template._id} template={template} onDelete={handleDeleteClick} />
                ))}
            </AnimatePresence>
          </motion.section>
        )}
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-md bg-card">
            <DialogHeader>
                <DialogTitle className="flex items-center text-lg font-semibold text-foreground"><Trash2 className="h-5 w-5 mr-2 text-destructive" />Confirm Deletion</DialogTitle>
            </DialogHeader>
            <DialogDescription className="py-4 text-muted-foreground">Are you sure you want to delete the template "<strong>{templateToDelete?.templateName}</strong>"? This action cannot be undone and may affect existing resumes using it.</DialogDescription>
            <DialogFooter className="sm:justify-end gap-2 pt-2">
              <DialogClose asChild><Button type="button" variant="outline" className="border-border">Cancel</Button></DialogClose>
              <Button type="button" variant="destructive" onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  );
};

export default AdminTemplatesPage;
