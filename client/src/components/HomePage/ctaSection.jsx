import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react'; // Added Sparkles

const CtaSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground" // Vibrant gradient
      aria-labelledby="cta-heading"
    >
      <div className="container mx-auto max-w-4xl text-center px-6 py-20 md:py-28 lg:py-32">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
            <Sparkles className="mx-auto h-12 w-12 text-primary-foreground/70 mb-6" strokeWidth={1.5} />
            <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Ready to Forge Your Future?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto mb-10 md:mb-12">
                Take the first step towards landing your dream job. Our AI-powered tools make resume building simple, effective, and even enjoyable.
            </p>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
            <Button
            size="lg"
            className="bg-background text-primary hover:bg-background/90 shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out px-10 py-3.5 text-lg font-semibold focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-4 focus-visible:ring-offset-primary rounded-lg"
            asChild
            >
            <NavLink to="/templates" aria-label="Create Your Professional Resume Now">
                Create Your Resume Now <ArrowRight className="ml-2.5 h-5 w-5" />
            </NavLink>
            </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CtaSection;
