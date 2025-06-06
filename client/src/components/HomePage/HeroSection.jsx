import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImg from '../../assets/images/hero-img.jpg'; // Ensure path is correct

const HeroSection = () => {
  return (
    <section
      className="w-full bg-gradient-to-br from-background via-muted/60 to-background text-foreground overflow-hidden" // Soft gradient background
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-between gap-12 md:gap-16 lg:gap-20 py-20 md:py-28 lg:py-32 min-h-[calc(100vh-64px)]"> {/* Adjust min-height based on navbar */}
          
          {/* Hero Text Content */}
          <motion.header
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="flex-1 max-w-2xl space-y-6 md:space-y-8 text-center md:text-left"
          >
            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-tight md:leading-snug">
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent pb-2 sm:pb-3">
                Build Your Career
              </span>
              <span className="block text-foreground mt-1 sm:mt-2">with AI-Powered Resumes</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
              Create professional, ATS-friendly resumes in minutes. Our advanced AI tools help you craft compelling content and stand out to employers.
            </p>
            <motion.nav
              aria-label="Primary actions"
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4 md:pt-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
              }}
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background px-8 py-3 text-base"
                  asChild
                >
                  <NavLink to="/templates" aria-label="Get Started with AI Resume Builder">
                    Get Started <span aria-hidden="true" className="ml-1.5">→</span>
                  </NavLink>
                </Button>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-border text-foreground hover:bg-accent hover:text-accent-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background px-8 py-3 text-base"
                  asChild
                >
                  <NavLink to="/templates" aria-label="View Resume Templates">
                    View Templates
                  </NavLink>
                </Button>
              </motion.div>
            </motion.nav>
          </motion.header>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, type: 'spring', stiffness: 100, damping: 15 }}
            className="flex justify-center flex-shrink-0 w-full sm:w-4/5 md:w-5/12 lg:max-w-xl xl:max-w-2xl mt-8 md:mt-0" // Adjusted widths
            role="presentation"
          >
            <img
              src={heroImg}
              loading="eager" // Eager load for LCP
              alt="AI Resume Builder dashboard interface showing a resume being edited with AI suggestions"
              className="rounded-xl md:rounded-2xl shadow-2xl object-cover w-full h-auto max-h-[450px] sm:max-h-[500px] md:max-h-[550px] lg:max-h-[600px] transition-shadow duration-300 ease-in-out hover:shadow-[0_30px_90px_-20px_hsl(var(--primary)/0.25)] border border-border/10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
