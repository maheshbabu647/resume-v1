import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

// --- Custom Hooks & Context ---
import useTemplateContext from '@/hooks/useTemplate';

// --- UI Components ---
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  Sparkles, 
  Star
} from 'lucide-react';

import TemplateCard from '@/components/Template/TemplateCard';

// --- Sub-components (no changes needed) ---

const SkeletonCard = () => (
  <div className="bg-card/60 backdrop-blur-sm rounded-lg border border-border shadow-sm overflow-hidden animate-pulse">
    <div className="aspect-[400/565] bg-secondary"></div>
    <div className="p-5 space-y-3">
      <div className="h-5 bg-border rounded-md w-3/4"></div>
      <div className="flex gap-4">
        <div className="h-4 bg-secondary rounded-full w-20"></div>
        <div className="h-4 bg-secondary rounded-full w-24"></div>
      </div>
    </div>
  </div>
);

const EmptyState = ({ activeFilter }) => (
  <motion.div 
    className="flex flex-col items-center justify-center py-20 text-center col-span-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div
      className="w-24 h-24 bg-gradient-to-br from-primary to-accent-purple rounded-full flex items-center justify-center mb-8 shadow-xl"
      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <FileText className="w-12 h-12 text-primary-foreground" />
    </motion.div>
    <h3 className="text-2xl font-bold text-foreground mb-4">
      {activeFilter === 'all' ? 'No Templates Available' : `No "${activeFilter}" Templates Found`}
    </h3>
    <p className="text-muted-foreground text-lg max-w-md mx-auto">
      {activeFilter === 'all'
        ? "We're working on amazing new templates. Check back soon!"
        : `Try selecting a different filter to see more options.`
      }
    </p>
  </motion.div>
);

const ErrorState = ({ error, refetch }) => (
  <motion.div 
    className="flex flex-col items-center justify-center py-20 col-span-full"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Alert className="max-w-md bg-destructive/10 backdrop-blur-sm border-destructive/20 rounded-2xl shadow-lg">
      <AlertCircle className="h-5 w-5 text-destructive" />
      <AlertTitle className="text-destructive font-bold">Unable to Load Templates</AlertTitle>
      <AlertDescription className="text-destructive/90 mt-2">
        {error?.message || 'Something went wrong. Please try again.'}
      </AlertDescription>
      <motion.div 
        className="mt-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={refetch} 
          variant="destructive"
          className="rounded-xl"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </motion.div>
    </Alert>
  </motion.div>
);

// --- Main Page Component ---
const TemplatesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const {
    templates,
    isLoadingTemplates,
    templateError,
    getAllTemplates,
  } = useTemplateContext();

  useEffect(() => {
    getAllTemplates();
  }, [getAllTemplates]);

  const tabs = ['All', 'Creative', 'ATS'];

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    if (activeFilter === 'all') return templates;
    if (activeFilter === 'ats') return templates.filter(t => t.isAtsRecommended);
    if (activeFilter === 'creative') return templates.filter(t => !t.isAtsRecommended);
    return [];
  }, [templates, activeFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <>
      <Helmet>
        <title>Professional Resume Templates | CareerForge</title>
        <meta name="description" content="Browse our collection of ATS-friendly, professional resume templates. Choose from modern designs created by experts to help you land your dream job." />
      </Helmet>

      <div className="bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-primary/5 to-accent-purple/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-accent-pink/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-7xl px-2 sm:px-4 md:px-6 pb-24 relative z-10">
          {/* _// VISUAL HIERARCHY UPDATE: Reduced padding and margins to make this section more compact._ */}
          <motion.div 
            className="text-center pt-10 sm:pt-12 mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-muted-foreground">Premium Templates</span>
            </motion.div>
            {/* _// VISUAL HIERARCHY UPDATE: Reduced heading font size._ */}
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Professional
              <span className="block bg-gradient-to-r from-primary via-accent-purple to-primary/80 bg-clip-text text-transparent">
                Resume Templates
              </span>
            </h1>
            {/* _// VISUAL HIERARCHY UPDATE: Reduced paragraph font size._ */}
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose from our collection of expertly crafted, ATS-friendly templates.
            </p>
          </motion.div>

          {/* _// VISUAL HIERARCHY UPDATE: Reduced bottom margin._ */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex justify-center border-b border-border">
              {tabs.map(tab => {
                const isActive = activeFilter === tab.toLowerCase();
                return (
                  // _// VISUAL HIERARCHY UPDATE: Made filter tabs smaller._
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab.toLowerCase())}
                    className={`relative px-4 py-2 text-sm sm:text-base font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary"
                        layoutId="underline"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div 
                // Responsive grid: 2 columns on small screens, 3 on large screens
                className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full"
                key={activeFilter}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                {templateError && <ErrorState error={templateError} refetch={getAllTemplates} />}

                {isLoadingTemplates && !templateError && (
                  [...Array(8)].map((_, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <SkeletonCard />
                    </motion.div>
                  ))
                )}

                {!isLoadingTemplates && !templateError && filteredTemplates.length === 0 && (
                  <EmptyState activeFilter={activeFilter} />
                )}

                {!isLoadingTemplates && !templateError && filteredTemplates.length > 0 && (
                  filteredTemplates.map((template) => (
                    <motion.div key={template._id} variants={itemVariants} layout className="w-full">
                      <Suspense fallback={<SkeletonCard />}>
                        <TemplateCard template={template} />
                      </Suspense>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default TemplatesPage;