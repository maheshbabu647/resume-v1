
// import React, { useEffect, useMemo, Suspense } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { motion } from 'framer-motion';

// // --- Custom Hooks & Context ---
// import useTemplateContext from '../hooks/useTemplate';

// // --- UI Components ---
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { AlertCircle, RefreshCw } from 'lucide-react';
// import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

// // Import the "smart" TemplateCard that now handles its own logic
// import TemplateCard from '../components/Template/TemplateCard';

// /**
//  * @component TemplatesPage
//  * @description This page displays a gallery of available resume templates, using your original UI.
//  * It separates templates into "Recommended" and "Creative" sections for better user guidance.
//  * It is a "dumb" component that only handles data fetching and layout.
//  */
// const TemplatesPage = () => {
//   const { templates, isLoadingTemplates, templatesError, getAllTemplates } = useTemplateContext();

//   // Fetch templates on initial load
//   useEffect(() => {
//     if (templates.length === 0) {
//       getAllTemplates();
//     }
//   }, [getAllTemplates, templates.length]);

//   // Memoize the lists to prevent re-filtering on every re-render
//   const recommendedTemplates = useMemo(() => templates.filter(t => t.isAtsRecommended), [templates]);
//   const creativeTemplates = useMemo(() => templates.filter(t => !t.isAtsRecommended), [templates]);

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
//         <meta name="description" content="Choose from our gallery of ATS-optimized and recruiter-approved resume templates." />
//       </Helmet>

//       {/* Hero Section (from your original file) */}
//       <header className="pt-24 pb-12 md:pt-28 md:pb-16 bg-gradient-to-b from-card to-background border-b border-border">
//         <div className="container mx-auto px-8 text-center">
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

//       {/* Main content area now has two sections */}
//       <main className="pt-12 pb-16 md:pt-16 md:pb-20 bg-background">
//         <div className="container mx-auto px-8 space-y-16">
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
//           ) : (
//             <>
//               {/* Section 1: Recommended for ATS */}
//               <section>
//                 <div className="text-center mb-10">
//                   <h2 className="text-3xl font-bold tracking-tight">Recommended for ATS</h2>
//                   <p className="mt-2 text-muted-foreground">These templates are your best bet for online applications.</p>
//                 </div>
//                 <motion.div
//                   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
//                   initial="hidden" animate="visible"
//                   variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
//                 >
//                   {recommendedTemplates.map((template) => (
//                     <Suspense key={template._id} fallback={<SkeletonCard />}>
//                       <TemplateCard template={template} />
//                     </Suspense>
//                   ))}
//                 </motion.div>
//               </section>

//               {/* Section 2: Creative Showcase */}
//               <section>
//                 <div className="text-center mb-10">
//                   <h2 className="text-3xl font-bold tracking-tight">Creative Showcase</h2>
//                   <p className="mt-2 text-muted-foreground">Best for portfolios and direct applications.</p>
//                 </div>
//                 <motion.div
//                   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
//                   initial="hidden" animate="visible"
//                   variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
//                 >
//                   {creativeTemplates.map((template) => (
//                     <Suspense key={template._id} fallback={<SkeletonCard />}>
//                       <TemplateCard template={template} />
//                     </Suspense>
//                   ))}
//                 </motion.div>
//               </section>
//             </>
//           )}
//         </div>
//       </main>
//     </>
//   );
// };

// export default TemplatesPage;

import React, { useEffect, useMemo, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

// --- Custom Hooks & Context ---
import useTemplateContext from '../hooks/useTemplate';

// --- UI Components ---
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from 'lucide-react';
import TemplateCard from '../components/Template/TemplateCard';

// A reusable skeleton loader
const SkeletonCard = () => (
    <div className="w-full">
        <div className="relative rounded-lg bg-card border border-border animate-pulse aspect-[3/4]"></div>
        <div className="h-5 bg-muted rounded w-3/4 mx-auto mt-4"></div>
    </div>
);

const TemplatesPage = () => {
  const { templates, isLoadingTemplates, templatesError, getAllTemplates } = useTemplateContext();

  useEffect(() => {
    if (templates.length === 0) {
      getAllTemplates();
    }
  }, [getAllTemplates, templates.length]);

  const recommendedTemplates = useMemo(() => templates.filter(t => t.isAtsRecommended), [templates]);
  const creativeTemplates = useMemo(() => templates.filter(t => !t.isAtsRecommended), [templates]);

  const renderContent = () => {
    if (isLoadingTemplates) {
      return (
        // CHANGE: Updated grid columns to be max 3 for larger cards
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

    return (
        <div className="space-y-14">
            <section>
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight">Recommended for ATS</h2>
                    <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                        Clean, professional, and optimized to pass through Applicant Tracking Systems. Your best bet for online applications.
                    </p>
                </div>
                {/* CHANGE: Updated grid columns to be max 3 for larger cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
                    initial="hidden" animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                    {recommendedTemplates.map((template) => (
                        <Suspense key={template._id} fallback={<SkeletonCard />}>
                            <TemplateCard template={template} />
                        </Suspense>
                    ))}
                </motion.div>
            </section>

            <section>
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight">Creative Showcase</h2>
                    <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                        Modern and visually striking designs. Best for portfolios, networking, or direct applications where personality is key.
                    </p>
                </div>
                {/* CHANGE: Updated grid columns to be max 3 for larger cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
                    initial="hidden" animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                    {creativeTemplates.map((template) => (
                        <Suspense key={template._id} fallback={<SkeletonCard />}>
                            <TemplateCard template={template} />
                        </Suspense>
                    ))}
                </motion.div>
            </section>
        </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Resume Templates | CareerForge</title>
        <meta name="description" content="Choose from our gallery of ATS-optimized and recruiter-approved resume templates." />
      </Helmet>

      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <header className="text-center">
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

        {/* CHANGE: Added a styled horizontal rule for separation */}
        <hr className="my-12 border-border" />

        <main>
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default TemplatesPage;