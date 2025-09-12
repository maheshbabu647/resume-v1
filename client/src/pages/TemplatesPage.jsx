import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

// --- Custom Hooks & Context ---
import useTemplateContext from '../hooks/useTemplate';

// --- UI Components ---
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, FileText } from 'lucide-react'; // Added FileText for empty state
import TemplateCard from '../components/Template/TemplateCard';

const SkeletonCard = () => (
    <div className="w-full">
        <div className="relative rounded-lg bg-card border border-border animate-pulse aspect-[3/4]"></div>
        <div className="h-5 bg-muted rounded w-3/4 mx-auto mt-4"></div>
    </div>
);

// REFACTOR: A single, consistent animation variant for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const TemplatesPage = () => {
  const { templates, isLoadingTemplates, templatesError, getAllTemplates } = useTemplateContext();

  // REFACTOR: 1. State for Active Filter
  // We'll start by showing all templates. 'ATS' and 'Creative' are other options.
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    // Fetch templates only if they haven't been fetched yet.
    if (templates.length === 0) {
      getAllTemplates();
    }
  }, [getAllTemplates, templates.length]);

  // REFACTOR: 2. Memoized Filtering Logic
  // This single memoized value will react to changes in the activeFilter state.
  const filteredTemplates = useMemo(() => {
    if (activeFilter === 'All') {
      return templates;
    }
    if (activeFilter === 'ATS') {
      return templates.filter(t => t.isAtsRecommended);
    }
    if (activeFilter === 'Creative') {
      return templates.filter(t => !t.isAtsRecommended);
    }
    return [];
  }, [templates, activeFilter]);

  // REFACTOR: 3. Centralized renderContent function
  const renderContent = () => {
    if (isLoadingTemplates) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
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

    // REFACTOR: 4. Added an empty state for when filters return no results
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
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
        // AnimatePresence will handle the exit/enter of items as the filter changes
      >
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

      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <header className="text-center mb-12">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-4xl md:text-5xl font-bold text-foreground tracking-tight"
            >
                Find Your Perfect Template
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            >
                Build a standout resume that gets past the bots and impresses hiring managers.
            </motion.p>
        </header>

        {/* REFACTOR: 5. Interactive Filter Bar */}
        <motion.div 
            className="flex justify-center items-center gap-2 md:gap-4 mb-12"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
        >
            <Button variant={activeFilter === 'All' ? 'default' : 'outline'} onClick={() => setActiveFilter('All')}>All Templates</Button>
            <Button variant={activeFilter === 'ATS' ? 'default' : 'outline'} onClick={() => setActiveFilter('ATS')}>ATS Recommended</Button>
            <Button variant={activeFilter === 'Creative' ? 'default' : 'outline'} onClick={() => setActiveFilter('Creative')}>Creative</Button>
        </motion.div>

        <main>
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default TemplatesPage;