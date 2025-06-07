import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
const FeatureCard = React.lazy(() => import('@/components/Common/Card/FeatureCard'));
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

const featuresData = [
  {
    title: "AI Resume Builder",
    description: "Craft professional, ATS-optimized resumes with intelligent suggestions and real-time feedback. Tailor your resume for specific jobs effortlessly.",
    icon: "resume",
    status: "available",
    linkTo: "/templates",
    actionText: "Build Your Resume"
  },
  {
    title: "AI Cover Letter Generator",
    description: "Generate compelling, personalized cover letters that complement your resume and highlight your unique qualifications for each application.",
    icon: "cover",
    status: "available", // Changed to available
    linkTo: "/cover-letter",
    actionText: "Generate Letter"
  },
  {
    title: "AI Mock Interview",
    description: "Practice common interview questions with an AI interviewer. Get instant feedback on your answers, delivery, and overall performance.",
    icon: "mock",
    status: "coming",
  },
];

const FeaturesSection = () => {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const SkeletonCard = () => (
    <div className="bg-card border border-border shadow-lg rounded-xl p-6 animate-pulse h-full flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-primary/10 p-3 rounded-lg h-14 w-14">
            <div className="bg-muted h-full w-full rounded"></div>
        </div>
        <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2 flex-grow">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
      <div className="mt-auto pt-5">
        <div className="h-10 bg-primary/50 rounded w-full"></div>
      </div>
    </div>
  );


  return (
    <section
      className="w-full py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background via-muted/30 to-background text-foreground"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-5">
            Unlock Your Career Potential
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            CareerForge provides a suite of AI-powered tools designed to help you create outstanding job application materials and ace your interviews.
          </p>
        </motion.div>

        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12"
        >
          <Suspense fallback={
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          }>
            {featuresData.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="h-full"
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  status={feature.status}
                  linkTo={feature.linkTo}
                  actionText={feature.actionText}
                />
              </motion.div>
            ))}
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
