import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const CtaSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full bg-primary text-primary-foreground"
      aria-labelledby="cta-heading"
    >
      <div className="container mx-auto px-6 text-center py-20 md:py-28">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Land Your Next Interview?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Stop letting a bad resume hold you back. Build a document that truly reflects your skills and experience in under 10 minutes.
            </p>
            {/* --- FIX START: Made the button responsive --- */}
            <Button
              size="lg"
              className="h-auto whitespace-normal bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-2xl transform hover:scale-105 active:scale-100 transition-all duration-200 ease-in-out px-6 sm:px-10 py-3 text-base sm:text-lg font-semibold"
              asChild
            >
              <NavLink to="/templates" aria-label="Start Building Your Winning Resume">
                Start Building My Winning Resume
              </NavLink>
            </Button>
            {/* --- FIX END --- */}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CtaSection;
