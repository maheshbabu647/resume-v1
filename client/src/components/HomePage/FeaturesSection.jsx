import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FileText, Mail, Sparkles, ArrowRight, Palette, Layers, Eye } from 'lucide-react';

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary/5 to-accent-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-accent-pink/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">The Power to Impress</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6">
            Total Control,
            <span className="block bg-gradient-to-r from-primary via-accent-purple to-primary/80 bg-clip-text text-transparent">
              Flawless Results.
            </span>
          </h2>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our tools give you the flexibility to create a truly personal and professional application, without the usual headaches.
          </p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Resume Builder Card */}
          <motion.div 
            className="group relative"
            variants={cardVariants}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-10 shadow-xl border border-border h-full">
              <motion.div 
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-primary rounded-2xl flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 shadow-lg"
                variants={iconVariants}
                whileHover="hover"
              >
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary-foreground" />
              </motion.div>

              <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                A Builder That Adapts to You
              </h3>
              
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6 lg:mb-8">
                Start with a professionally designed template and preset, then take full control. Add, remove, and reorder sections, adjust spacing and fonts—all while seeing your changes instantly in a live preview.
              </p>

              <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground font-medium text-xs sm:text-sm">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span>Start Fast with Guided Presets</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground font-medium text-xs sm:text-sm">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span>Fully Customize Your Layout & Style</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground font-medium text-xs sm:text-sm">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span>See Your Changes Instantly</span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <NavLink 
                  to="/templates" 
                  className="inline-flex items-center gap-2 sm:gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-2xl font-semibold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Start Building
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </NavLink>
              </motion.div>
            </div>
          </motion.div>

          {/* Cover Letter Builder Card */}
          <motion.div 
            className="group relative"
            variants={cardVariants}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-10 shadow-xl border border-border h-full">
              <motion.div 
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 shadow-lg"
                variants={iconVariants}
                whileHover="hover"
              >
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
              </motion.div>

              <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                AI-Powered Cover Letters.
              </h3>
              
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6 lg:mb-8">
                Create a compelling cover letter in minutes. Our templates are designed to perfectly match your resume, creating a professional and cohesive application package that shows you're serious about the role.
              </p>

              <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6 lg:mb-8">
                 <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground font-medium text-xs sm:text-sm">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-accent-purple flex-shrink-0" />
                  <span>Tailored to Any Job Description</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground font-medium text-xs sm:text-sm">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent-purple flex-shrink-0" />
                  <span>Ready in Seconds</span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <NavLink 
                  to="/cover-letter-builder" 
                  className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-accent-purple to-accent-pink hover:opacity-90 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-2xl font-semibold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Generate My Cover Letter
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </NavLink>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
