import React, { useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import useTemplateContext from '../hooks/useTemplate';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, LayoutGrid } from 'lucide-react';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
const TemplateCard = React.lazy(() => import('../components/Template/TemplateCard'));

const TemplatesPage = () => {
  const { templates, isLoadingTemplates, templatesError, getAllTemplates } = useTemplateContext();

  // This useEffect now safely calls getAllTemplates without causing an infinite loop
  useEffect(() => {
    // Only fetch if templates haven't been loaded yet to avoid unnecessary calls
    if (templates.length === 0) {
      getAllTemplates();
    }
  }, [getAllTemplates, templates.length]);

  const SkeletonCard = () => (
    <div className="bg-card border border-border shadow-lg rounded-xl p-4 animate-pulse h-full">
        <div className="w-full h-52 bg-muted rounded-lg mb-4"></div>
        <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="mt-auto pt-5">
            <div className="h-10 bg-primary/50 rounded w-full"></div>
        </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Resume Templates | CareerForge</title>
        <meta name="description" content="Choose from a variety of professionally designed resume templates to get started." />
      </Helmet>
      <div className="container mx-auto max-w-7xl px-4 py-10 md:py-16">
        <motion.header 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">Choose Your Template</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a professionally designed template to start building your standout resume.
          </p>
        </motion.header>

        <div>
          {isLoadingTemplates ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : templatesError ? (
            <div className="text-center py-10">
              <Alert variant="destructive" className="max-w-md mx-auto mb-6">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Failed to Load Templates</AlertTitle>
                <AlertDescription>{templatesError}</AlertDescription>
              </Alert>
              <Button onClick={() => getAllTemplates()} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Templates Available</h3>
                <p className="mt-1 text-sm text-muted-foreground">We're working on adding new templates. Please check back later.</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              <AnimatePresence>
                {templates.map((template) => (
                    <Suspense key={template._id} fallback={<SkeletonCard />}>
                        <TemplateCard template={template} />
                    </Suspense>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default TemplatesPage;
