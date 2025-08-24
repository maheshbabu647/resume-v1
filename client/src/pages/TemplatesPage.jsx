
// import React, { useEffect, useMemo, useState, Suspense } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { motion, AnimatePresence } from 'framer-motion';
// import useTemplateContext from '../hooks/useTemplate';

// // UI Components
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AlertCircle, RefreshCw, LayoutGrid, X } from 'lucide-react';
// import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

// const TemplateCard = React.lazy(() => import('../components/Template/TemplateCard'));

// const TemplatesPage = () => {
//   const { templates, isLoadingTemplates, templatesError, getAllTemplates } = useTemplateContext();

//   const [filters, setFilters] = useState({
//     industry: 'all',
//     style: 'all',
//     level: 'all',
//   });

//   useEffect(() => {
//     if (templates.length === 0) {
//       getAllTemplates();
//     }
//   }, [getAllTemplates, templates.length]);

//   const filterOptions = useMemo(() => {
//     const industries = new Set();
//     const styles = new Set();
//     const levels = new Set();

//     templates.forEach(t => {
//       if (t.tags?.industry) t.tags.industry.forEach(i => industries.add(i));
//       if (t.tags?.style) styles.add(t.tags.style);
//       if (t.tags?.level) t.tags.level.forEach(l => levels.add(l));
//     });

//     return {
//       industries: Array.from(industries).sort(),
//       styles: Array.from(styles).sort(),
//       levels: Array.from(levels).sort(),
//     };
//   }, [templates]);

//   const handleFilterChange = (filterName, value) => {
//     setFilters(prev => ({ ...prev, [filterName]: value }));
//   };

//   const resetFilters = () => {
//     setFilters({ industry: 'all', style: 'all', level: 'all' });
//   };

//   const areFiltersActive = filters.industry !== 'all' || filters.style !== 'all' || filters.level !== 'all';

//   const filteredAndExpandedTemplates = useMemo(() => {
//     const allVirtualTemplates = templates.flatMap(template => {
//       if (template.tags?.industry && Array.isArray(template.tags.industry) && template.tags.industry.length > 0) {
//         return template.tags.industry.map(industry => ({
//           ...template,
//           virtualId: `${template._id}-${industry}`,
//           specificIndustry: industry,
//           templateName: `${template.templateName} - ${industry}`,
//         }));
//       }
//       return [{ ...template, virtualId: template._id, specificIndustry: null }];
//     });

//     return allVirtualTemplates.filter(virtualTemplate => {
//       const { tags, specificIndustry } = virtualTemplate;
//       if (!tags) return false;
//       const styleMatch = filters.style === 'all' || tags.style === filters.style;
//       const levelMatch = filters.level === 'all' || tags.level?.includes(filters.level);
//       const industryMatch = filters.industry === 'all' || specificIndustry === filters.industry;
//       return styleMatch && levelMatch && industryMatch;
//     });
//   }, [templates, filters]);

//   const SkeletonCard = () => (
//     <div className="w-full">
//       <div className="relative rounded-lg bg-card border border-border animate-pulse aspect-[3/4]"></div>
//       <div className="h-5 bg-muted rounded w-3/4 mx-auto mt-4"></div>
//     </div>
//   );

//   return (
//     <>
//       <Helmet>
//         <title>Resume Templates | CareerForge</title>
//         <meta name="description" content="Choose from our gallery of ATS-optimized and recruiter-approved resume templates to build a standout resume that gets noticed." />
//       </Helmet>

//       {/* Templates Hero Section */}
//       <header className="pt-24 pb-12 md:pt-28 md:pb-16 bg-gradient-to-b from-card to-background border-b border-border">
//         <div className="container mx-auto px-8 text-center"> {/* Increased horizontal padding */}
//           <motion.h1 
//             initial={{ opacity: 0, y: -20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             className="text-4xl md:text-5xl font-bold text-foreground tracking-tight"
//           >
//             ATS-Optimized & Recruiter-Approved
//           </motion.h1>
//           <motion.p 
//             initial={{ opacity: 0, y: -20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             transition={{ delay: 0.1 }}
//             className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
//           >
//             Choose a professionally designed template to build a standout resume that gets past the bots and impresses hiring managers.
//           </motion.p>
//         </div>
//       </header>

//       {/* Filters Section */}
//       <section className="py-4 sticky top-16 bg-card/90 backdrop-blur-lg z-30 border-b border-border">
//         <div className="container mx-auto px-8"> {/* Increased horizontal padding */}
//           <div className="flex flex-col sm:flex-row gap-4 items-center">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
//               <Select value={filters.style} onValueChange={(value) => handleFilterChange('style', value)}>
//                 <SelectTrigger><SelectValue placeholder="Filter by Style..." /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Styles</SelectItem>
//                   {filterOptions.styles.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//               <Select value={filters.level} onValueChange={(value) => handleFilterChange('level', value)}>
//                 <SelectTrigger><SelectValue placeholder="Filter by Experience..." /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Levels</SelectItem>
//                   {filterOptions.levels.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//               <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
//                 <SelectTrigger><SelectValue placeholder="Filter by Industry..." /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Industries</SelectItem>
//                   {filterOptions.industries.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>
//             {areFiltersActive && (
//               <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-primary w-full sm:w-auto flex-shrink-0">
//                 <X className="w-4 h-4 mr-2" />
//                 Clear Filters
//               </Button>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Templates Gallery - CORRECTED SPACING */}
//       <main className="pt-12 pb-16 md:pt-16 md:pb-20 bg-background">
//         <div className="container mx-auto px-8"> {/* Increased horizontal padding */}
//           {isLoadingTemplates ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
//             </div>
//           ) : templatesError ? (
//             <div className="text-center py-10">
//               <Alert variant="destructive" className="max-w-md mx-auto mb-6">
//                 <AlertCircle className="h-5 w-5" /><AlertTitle>Failed to Load Templates</AlertTitle><AlertDescription>{templatesError}</AlertDescription>
//               </Alert>
//               <Button onClick={() => getAllTemplates()} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
//             </div>
//           ) : filteredAndExpandedTemplates.length === 0 ? (
//             <div className="text-center py-20 border-2 border-dashed rounded-lg">
//               <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground" />
//               <h3 className="mt-4 text-lg font-medium">No Templates Found</h3>
//               <p className="mt-1 text-sm text-muted-foreground">No templates match your current filter selection. Try clearing the filters.</p>
//             </div>
//           ) : (
//             <motion.div
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
//               initial="hidden"
//               animate="visible"
//               variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
//             >
//               <AnimatePresence>
//                 {filteredAndExpandedTemplates.map((template) => (
//                   <Suspense key={template.virtualId} fallback={<SkeletonCard />}>
//                     <TemplateCard template={template} />
//                   </Suspense>
//                 ))}
//               </AnimatePresence>
//             </motion.div>
//           )}
//         </div>
//       </main>
//     </>
//   );
// };

// export default TemplatesPage;


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

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      if (!template.tags) return false;

      const styleMatch = filters.style === 'all' || template.tags.style === filters.style;
      const levelMatch = filters.level === 'all' || template.tags.level?.includes(filters.level);
      // Check if the template's industry array includes the selected filter
      const industryMatch = filters.industry === 'all' || template.tags.industry?.includes(filters.industry);

      return styleMatch && levelMatch && industryMatch;
    });
  }, [templates, filters]);

  const SkeletonCard = () => (
    <div className="w-full">
      <div className="relative rounded-lg bg-card border border-border animate-pulse aspect-[3/4]"></div>
      <div className="h-5 bg-muted rounded w-3/4 mx-auto mt-4"></div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Resume Templates | CareerForge</title>
        <meta name="description" content="Choose from our gallery of ATS-optimized and recruiter-approved resume templates to build a standout resume that gets noticed." />
      </Helmet>

      {/* Templates Hero Section */}
      <header className="pt-24 pb-12 md:pt-28 md:pb-16 bg-gradient-to-b from-card to-background border-b border-border">
        <div className="container mx-auto px-8 text-center"> {/* Increased horizontal padding */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-5xl font-bold text-foreground tracking-tight"
          >
            ATS-Optimized & Recruiter-Approved
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Choose a professionally designed template to build a standout resume that gets past the bots and impresses hiring managers.
          </motion.p>
        </div>
      </header>

      {/* Filters Section */}
      <section className="py-4 sticky top-16 bg-card/90 backdrop-blur-lg z-30 border-b border-border">
        <div className="container mx-auto px-8"> {/* Increased horizontal padding */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
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
          </div>
        </div>
      </section>

      {/* Templates Gallery */}
      <main className="pt-12 pb-16 md:pt-16 md:pb-20 bg-background">
        <div className="container mx-auto px-8"> {/* Increased horizontal padding */}
          {isLoadingTemplates ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : templatesError ? (
            <div className="text-center py-10">
              <Alert variant="destructive" className="max-w-md mx-auto mb-6">
                <AlertCircle className="h-5 w-5" /><AlertTitle>Failed to Load Templates</AlertTitle><AlertDescription>{templatesError}</AlertDescription>
              </Alert>
              <Button onClick={() => getAllTemplates()} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
              <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Templates Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">No templates match your current filter selection. Try clearing the filters.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              <AnimatePresence>
                {filteredTemplates.map((template) => (
                  <Suspense key={template._id} fallback={<SkeletonCard />}>
                    <TemplateCard template={template} />
                  </Suspense>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
};

export default TemplatesPage;