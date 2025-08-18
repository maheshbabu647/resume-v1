// import React, { Suspense } from 'react';
// import { motion } from 'framer-motion';
// const FeatureCard = React.lazy(() => import('@/components/Common/Card/FeatureCard'));
// import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

// const featuresData = [
//   {
//     title: "AI Resume Builder",
//     description: "Craft professional, ATS-optimized resumes with intelligent suggestions and real-time feedback. Tailor your resume for specific jobs effortlessly.",
//     icon: "resume",
//     status: "available",
//     linkTo: "/templates",
//     actionText: "Build Your Resume"
//   },
//   {
//     title: "AI Cover Letter Generator",
//     description: "Generate compelling, personalized cover letters that complement your resume and highlight your unique qualifications for each application.",
//     icon: "cover",
//     status: "available", // Changed to available
//     linkTo: "/cover-letter/generate",
//     actionText: "Generate Letter"
//   },
//   {
//     title: "AI Mock Interview",
//     description: "Practice common interview questions with an AI interviewer. Get instant feedback on your answers, delivery, and overall performance.",
//     icon: "mock",
//     status: "coming",
//   },
// ];

// const FeaturesSection = () => {
//   const listVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20, scale: 0.98 },
//     visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
//   };

//   const SkeletonCard = () => (
//     <div className="bg-card border border-border shadow-lg rounded-xl p-6 animate-pulse h-full flex flex-col">
//       <div className="flex items-start gap-4 mb-4">
//         <div className="bg-primary/10 p-3 rounded-lg h-14 w-14">
//             <div className="bg-muted h-full w-full rounded"></div>
//         </div>
//         <div className="flex-1 space-y-2">
//             <div className="h-5 bg-muted rounded w-3/4"></div>
//             <div className="h-3 bg-muted rounded w-1/2"></div>
//         </div>
//       </div>
//       <div className="space-y-2 flex-grow">
//         <div className="h-4 bg-muted rounded w-full"></div>
//         <div className="h-4 bg-muted rounded w-full"></div>
//         <div className="h-4 bg-muted rounded w-5/6"></div>
//       </div>
//       <div className="mt-auto pt-5">
//         <div className="h-10 bg-primary/50 rounded w-full"></div>
//       </div>
//     </div>
//   );


//   return (
//     <section
//       className="w-full py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background via-muted/30 to-background text-foreground"
//       aria-labelledby="features-heading"
//     >
//       <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-8 text-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="max-w-3xl mx-auto mb-16 md:mb-20"
//         >
//           <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-5">
//             Unlock Your Career Potential
//           </h2>
//           <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
//             CareerForge provides a suite of AI-powered tools designed to help you create outstanding job application materials and ace your interviews.
//           </p>
//         </motion.div>

//         <motion.div
//           variants={listVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.1 }}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12"
//         >
//           <Suspense fallback={
//             <>
//               <SkeletonCard />
//               <SkeletonCard />
//               <SkeletonCard />
//             </>
//           }>
//             {featuresData.map((feature) => (
//               <motion.div
//                 key={feature.title}
//                 variants={itemVariants}
//                 className="h-full"
//               >
//                 <FeatureCard
//                   title={feature.title}
//                   description={feature.description}
//                   icon={feature.icon}
//                   status={feature.status}
//                   linkTo={feature.linkTo}
//                   actionText={feature.actionText}
//                 />
//               </motion.div>
//             ))}
//           </Suspense>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default FeaturesSection;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const features = [
  {
    id: 'resume',
    tabName: 'AI Resume Builder',
    title: 'Build a Perfect Resume in Minutes',
    description: 'Our AI analyzes your experience and suggests powerful, industry-specific keywords. See your changes in a real-time preview and build a resume that beats the bots.',
    // IMPORTANT: Replace these placeholder GIFs with your actual screen recordings/animations
    visual: 'https://i.imgur.com/8bY2Y9G.gif',
  },
  {
    id: 'coverLetter',
    tabName: 'AI Cover Letter Generator',
    title: 'Generate Tailored Cover Letters',
    description: 'Simply paste the job description. Our AI will craft a compelling, personalized cover letter that highlights your most relevant skills and experience for that specific role.',
    visual: 'https://i.imgur.com/L4Z1S7z.gif',
  },
  {
    id: 'interview',
    tabName: 'AI Mock Interview',
    title: 'Ace Your Next Interview',
    description: 'Practice common interview questions with our AI. Get instant feedback on your answers, delivery, and overall performance to walk into any interview with confidence.',
    visual: 'https://i.imgur.com/rT3bA5m.gif',
  },
];

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState(features[0].id);
  const activeFeature = features.find((feature) => feature.id === activeTab);

  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Your All-in-One Career Toolkit</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Everything you need to stand out, from application to interview.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Tabs Navigation */}
          <div className="flex justify-center border-b border-border mb-8">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={cn(
                  "py-3 px-4 sm:px-6 text-sm sm:text-base font-medium transition-colors duration-200 relative",
                  activeTab === feature.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {feature.tabName}
                {activeTab === feature.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="underline"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Feature Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <div className="bg-background p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold mb-3 text-foreground">{activeFeature.title}</h3>
                <p className="text-muted-foreground">{activeFeature.description}</p>
              </div>
              <div className="w-full h-auto aspect-video overflow-hidden rounded-lg shadow-xl">
                 <img
                    src={activeFeature.visual}
                    alt={`${activeFeature.tabName} in action`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://placehold.co/600x400/FAFAFA/CCCCCC?text=Feature+Demo`;
                    }}
                  />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;