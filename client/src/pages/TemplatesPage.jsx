import React, { useEffect, Suspense, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, FileSearch } from 'lucide-react'; // Added FileSearch
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
const TemplateCard = React.lazy(() => import('@/components/Template/TemplateCard'));
import useTemplateContext from '@/hooks/useTemplate';

const TemplatesPage = () => {
  const {
    templates,
    isLoadingTemplates,
    templatesError,
    getAllTemplates
  } = useTemplateContext();

  const [activeTab, setActiveTab] = useState("all"); // For future filtering logic

  useEffect(() => {
    if ((!templates || templates.length === 0) && !isLoadingTemplates) {
      getAllTemplates();
    }
  }, [getAllTemplates, templates, isLoadingTemplates]);

  const handleRetry = () => {
    getAllTemplates();
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };


  return (
    <>
      <Helmet>
        <title>Explore Resume Templates | CareerForge</title>
        <meta
          name="description"
          content="Discover a wide array of professionally designed resume templates. Choose from modern, creative, or minimalist styles to kickstart your career journey with CareerForge."
        />
        <meta property="og:title" content="Explore Resume Templates | CareerForge" />
        <meta property="og:description" content="Find and customize the perfect resume template. ATS-friendly designs to help you land your dream job." />
      </Helmet>

      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="min-h-screen bg-background text-foreground"
      >
        <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20" aria-label="Resume Templates Main Content">
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mb-12 md:mb-16 text-center"
            aria-labelledby="templates-page-title"
          >
            <h1 id="templates-page-title" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-4">
              Choose Your Perfect Template
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Select a professionally designed, ATS-friendly template. Customize it with your details and let our AI assist you in crafting a standout resume.
            </p>
          </motion.header>

          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10 md:mb-12 flex justify-center"
            aria-label="Template Category Filters"
          >
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-muted p-1.5 rounded-lg shadow-sm">
                {['all', 'professional', 'creative', 'simple'].map((tabValue) => (
                  <TabsTrigger
                    key={tabValue}
                    value={tabValue}
                    className="px-4 py-2 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover:bg-accent/50 rounded-md transition-all duration-150 ease-in-out"
                  >
                    {tabValue.charAt(0).toUpperCase() + tabValue.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.nav>

          {isLoadingTemplates ? (
            <div className="flex justify-center items-center py-24" aria-busy="true" aria-live="polite">
              <LoadingSpinner size="xlarge" label="Loading templates..." colorClassName="text-primary" />
            </div>
          ) : templatesError ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center" role="alert">
              <Alert variant="destructive" className="max-w-md w-full mb-6">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Failed to Load Templates</AlertTitle>
                <AlertDescription>{typeof templatesError === 'string' ? templatesError : "We couldn't retrieve templates. Please check your connection."}</AlertDescription>
              </Alert>
              <Button onClick={handleRetry} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </motion.div>
          ) : templates && templates.length > 0 ? (
            <motion.section
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              aria-label="Available Resume Templates Grid"
            >
              <Suspense fallback={
                Array.from({ length: Math.min(templates.length, 8) }).map((_, i) => ( // Show skeletons for up to 8 or actual length
                  <motion.div key={`skeleton-${i}`} variants={itemVariants} className="bg-card p-4 rounded-xl border border-border shadow-lg animate-pulse">
                    <div className="aspect-w-3 aspect-h-4 bg-muted rounded-md mb-4"></div>
                    <div className="h-5 bg-muted rounded w-3/4 mb-2.5"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mb-5"></div>
                    <div className="h-10 bg-primary/50 rounded w-full"></div>
                  </motion.div>
                ))
              }>
                {templates.map((template) => (
                  <motion.div key={template._id} variants={itemVariants} className="h-full">
                    <TemplateCard template={template} />
                  </motion.div>
                ))}
              </Suspense>
            </motion.section>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 flex flex-col items-center">
              <FileSearch size={64} className="text-muted-foreground mb-6" strokeWidth={1} />
              <h2 className="text-2xl font-semibold text-foreground mb-3">No Templates Available Yet</h2>
              <p className="text-muted-foreground max-w-md">
                It seems there are no templates to display right now. Please check back soon, or if you're an admin, consider adding some!
              </p>
            </motion.div>
          )}
        </main>
      </motion.div>
    </>
  );
};

export default TemplatesPage;
