import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import useTemplateContext from '../hooks/useTemplate';

// UI Components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, RefreshCw, LayoutGrid, X } from 'lucide-react';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

const TemplateCard = React.lazy(() => import('../components/Template/TemplateCard'));

const TemplatesPage = () => {
  const { templates, isLoadingTemplates, templatesError, getAllTemplates } = useTemplateContext();

  const [filters, setFilters] = useState({
    industry: 'all',
    style: 'all',
    level: 'all',
  });

  useEffect(() => {
    if (templates.length === 0) {
      getAllTemplates();
    }
  }, [getAllTemplates, templates.length]);

  const filterOptions = useMemo(() => {
    const industries = new Set();
    const styles = new Set();
    const levels = new Set();

    templates.forEach(t => {
      if (t.tags?.industry) t.tags.industry.forEach(i => industries.add(i));
      if (t.tags?.style) styles.add(t.tags.style);
      if (t.tags?.level) t.tags.level.forEach(l => levels.add(l));
    });

    return {
      industries: Array.from(industries).sort(),
      styles: Array.from(styles).sort(),
      levels: Array.from(levels).sort(),
    };
  }, [templates]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({ industry: 'all', style: 'all', level: 'all' });
  };
  
  const areFiltersActive = filters.industry !== 'all' || filters.style !== 'all' || filters.level !== 'all';

  // --- **REWRITTEN LOGIC**: Expand ALL templates first, THEN filter the result ---
  const filteredAndExpandedTemplates = useMemo(() => {
    // 1. First, expand every template into its industry-specific "virtual" cards.
    const allVirtualTemplates = templates.flatMap(template => {
      // If a template has industries, create a virtual card for each one.
      if (template.tags?.industry && Array.isArray(template.tags.industry) && template.tags.industry.length > 0) {
        return template.tags.industry.map(industry => ({
          ...template,
          virtualId: `${template._id}-${industry}`,
          specificIndustry: industry, // This property is crucial for filtering
          templateName: `${template.templateName} - ${industry}`,
        }));
      }
      // If a template has no industries, treat it as a single card.
      return [{ ...template, virtualId: template._id, specificIndustry: null }];
    });

    // 2. Now, filter the fully expanded list of virtual cards.
    return allVirtualTemplates.filter(virtualTemplate => {
      const { tags, specificIndustry } = virtualTemplate;
      if (!tags) return false;

      const styleMatch = filters.style === 'all' || tags.style === filters.style;
      const levelMatch = filters.level === 'all' || tags.level?.includes(filters.level);
      
      // The filter now checks the 'specificIndustry' of each virtual card.
      const industryMatch = filters.industry === 'all' || specificIndustry === filters.industry;
      
      return styleMatch && levelMatch && industryMatch;
    });
  }, [templates, filters]);

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
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">Choose Your Template</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a professionally designed template to start building your standout resume.
          </p>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="mb-10 md:mb-12 p-4 bg-card border rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <Select value={filters.style} onValueChange={(value) => handleFilterChange('style', value)}>
                    <SelectTrigger><SelectValue placeholder="Filter by Style..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Styles</SelectItem>
                        {filterOptions.styles.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Select value={filters.level} onValueChange={(value) => handleFilterChange('level', value)}>
                    <SelectTrigger><SelectValue placeholder="Filter by Experience..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        {filterOptions.levels.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
                    <SelectTrigger><SelectValue placeholder="Filter by Industry..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        {filterOptions.industries.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            {areFiltersActive && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-primary w-full sm:w-auto flex-shrink-0">
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
              </Button>
            )}
        </motion.div>

        <div>
          {isLoadingTemplates ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : templatesError ? (
            <div className="text-center py-10">
              <Alert variant="destructive" className="max-w-md mx-auto mb-6">
                <AlertCircle className="h-5 w-5" /><AlertTitle>Failed to Load Templates</AlertTitle><AlertDescription>{templatesError}</AlertDescription>
              </Alert>
              <Button onClick={() => getAllTemplates()} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
            </div>
          ) : filteredAndExpandedTemplates.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
              <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Templates Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">No templates match your current filter selection. Try clearing the filters.</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 items-stretch"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              <AnimatePresence>
                {/* --- MODIFIED: Use the new, correctly filtered and expanded list --- */}
                {filteredAndExpandedTemplates.map((template) => (
                  <Suspense key={template.virtualId} fallback={<SkeletonCard />}>
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