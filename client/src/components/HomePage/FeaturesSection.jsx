import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FileText, Mail } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Your Essential Career Tools</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Everything you need to create a professional application.
          </p>
        </motion.div>

        {/* Two-Card Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8"
        >
          {/* Card 1: Resume Builder */}
          <NavLink
            to="/templates"
            className="group relative block overflow-hidden p-8 bg-card rounded-xl border border-border shadow-sm transition-all duration-300 hover:border-primary/60 hover:shadow-primary/10"
          >
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/20 blur-3xl opacity-40 transition-opacity duration-300 group-hover:opacity-100"></div>
            
            <div className="relative flex flex-col h-full">
              {/* Styled Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" strokeWidth={2} />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">Resume Builder</h3>
              <p className="text-muted-foreground mb-4 flex-grow">
                Create a professional, ATS-friendly resume using our expertly designed templates.
              </p>
              <div className="mt-auto">
                <span className="font-semibold text-primary group-hover:translate-x-1 transition-transform duration-200 block">
                  Start Building →
                </span>
              </div>
            </div>
          </NavLink>

          {/* Card 2: Cover Letter Builder */}
          <NavLink
            to="/cover-letter/generate"
            className="group relative block overflow-hidden p-8 bg-card rounded-xl border border-border shadow-sm transition-all duration-300 hover:border-primary/60 hover:shadow-primary/10"
          >
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-primary/20 blur-3xl opacity-40 transition-opacity duration-300 group-hover:opacity-100"></div>

            <div className="relative flex flex-col h-full">
               {/* Styled Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" strokeWidth={2} />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">Cover Letter Builder</h3>
              <p className="text-muted-foreground mb-4 flex-grow">
                Craft a compelling cover letter with a clear, professional structure that gets you noticed.
              </p>
              <div className="mt-auto">
                <span className="font-semibold text-primary group-hover:translate-x-1 transition-transform duration-200 block">
                  Start Crafting →
                </span>
              </div>
            </div>
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
