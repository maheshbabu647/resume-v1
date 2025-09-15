import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import useTemplateContext from '../hooks/useTemplate';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, FileText } from 'lucide-react';
import TemplateCard from '../components/Template/TemplateCard';

const SkeletonCard = () => (
    <div className="w-full">
        <div className="aspect-[3/4] overflow-hidden">
            <div className="w-full h-full bg-muted animate-pulse"></div>
        </div>
        <div className="h-5 bg-muted rounded w-3/4 mx-auto mt-3 animate-pulse"></div>
    </div>
);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const TemplatesPage = () => {
  const { templates, isLoadingTemplates, templatesError, getAllTemplates } = useTemplateContext();
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (templates.length === 0) {
      getAllTemplates();
    }
  }, [getAllTemplates, templates.length]);

  const filteredTemplates = useMemo(() => {
    if (activeFilter === 'All') return templates;
    if (activeFilter === 'ATS') return templates.filter(t => t.isAtsRecommended);
    if (activeFilter === 'Creative') return templates.filter(t => !t.isAtsRecommended);
    return [];
  }, [templates, activeFilter]);

  const renderContent = () => {
    const gridClasses = "grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10";

    if (isLoadingTemplates) {
      return (
        <div className={gridClasses}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (templatesError) {
      return (
        <div className="text-center py-10">
            <Alert variant="destructive" className="max-w-md mx-auto mb-6">
                <AlertCircle className="h-5 w-5" /><AlertTitle>Failed to Load Templates</AlertTitle><AlertDescription>{templatesError}</AlertDescription>
            </Alert>
            <Button onClick={() => getAllTemplates()} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
        </div>
      );
    }
    
    if (filteredTemplates.length === 0 && !isLoadingTemplates) {
        return (
            <div className="text-center py-20 bg-muted/50 rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No Templates Found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    There are no templates matching the "{activeFilter}" category.
                </p>
            </div>
        )
    }

    return (
      <motion.div className={gridClasses}>
        <AnimatePresence>
            {filteredTemplates.map((template) => (
                <motion.div key={template._id} variants={cardVariants} layout>
                    <Suspense fallback={<SkeletonCard />}>
                        <TemplateCard template={template} />
                    </Suspense>
                </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Resume Templates | CareerForge</title>
        <meta name="description" content="Choose from our gallery of ATS-optimized and creative resume templates to land your dream job." />
      </Helmet>

      <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-12">
        {/* --- REFINED: Header is more compact on mobile --- */}
        <header className="text-center mb-6 sm:mb-10">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                // --- CHANGE: Reduced base font size for mobile ---
                className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight"
            >
                Find Your Perfect Template
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                // --- CHANGE: Reduced base font size for mobile ---
                className="mt-2 sm:mt-4 text-sm sm:text-lg text-muted-foreground max-w-3xl mx-auto"
            >
                Build a standout resume that gets past the bots and impresses hiring managers.
            </motion.p>
        </header>

        <motion.div 
            className="flex justify-center items-center flex-wrap gap-2 md:gap-3 mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
        >
            {/* --- CHANGE: Added size="sm" to all filter buttons --- */}
            <Button size="sm" variant={activeFilter === 'All' ? 'default' : 'outline'} onClick={() => setActiveFilter('All')}>All Templates</Button>
            <Button size="sm" variant={activeFilter === 'ATS' ? 'default' : 'outline'} onClick={() => setActiveFilter('ATS')}>ATS Friendly</Button>
            <Button size="sm" variant={activeFilter === 'Creative' ? 'default' : 'outline'} onClick={() => setActiveFilter('Creative')}>Creative</Button>
        </motion.div>

        <main>
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default TemplatesPage;