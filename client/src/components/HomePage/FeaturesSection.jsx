import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FileText, Mail, Sparkles, ArrowRight, Palette, Layers, Eye, Upload, File } from 'lucide-react';

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  // Card Data Array for cleaner, maintainable code
  const features = [
    {
      icon: FileText,
      iconBg: 'bg-primary',
      iconColor: 'text-primary-foreground',
      title: 'A Builder That Adapts to You',
      desc: 'Start with a professionally designed template, then take full control. Add, remove, and reorder sections, adjust spacing—all while seeing changes instantly.',
      perks: [
        { icon: Layers, text: 'Start Fast with Guided Presets', iconColor: 'text-primary' },
        { icon: Palette, text: 'Fully Customize Your Layout & Style', iconColor: 'text-primary' },
        { icon: Eye, text: 'See Your Changes Instantly', iconColor: 'text-primary' },
      ],
      buttonText: 'Start Building',
      buttonLink: '/templates',
      buttonBg: 'bg-primary hover:bg-primary/90',
      buttonTextColor: 'text-primary-foreground'
    },
    {
      icon: Mail,
      iconBg: 'bg-gradient-to-br from-accent-purple to-accent-pink',
      iconColor: 'text-white',
      title: 'AI-Powered Cover Letters',
      desc: 'Create a compelling cover letter in minutes. Our templates match your resume, creating a cohesive application that shows you\'re serious about the role.',
      perks: [
        { icon: Palette, text: 'Tailored to Any Job Description', iconColor: 'text-accent-purple' },
        { icon: ArrowRight, text: 'Ready in Seconds', iconColor: 'text-accent-purple' },
      ],
      buttonText: 'Generate My Cover Letter',
      buttonLink: '/cover-letter/generate',
      buttonBg: 'bg-gradient-to-r from-accent-purple to-accent-pink hover:opacity-90',
      buttonTextColor: 'text-white'
    },
    {
      icon: Upload,
      iconBg: 'bg-gradient-to-br from-success to-emerald-600',
      iconColor: 'text-white',
      title: 'ATS Score Checker',
      desc: 'Upload your resume and job description to get an ATS compatibility score. We analyze your resume against job requirements and provide detailed feedback.',
      perks: [
        { icon: File, text: 'Resume & Job Description Upload', iconColor: 'text-success' },
        { icon: Sparkles, text: 'AI-Powered ATS Analysis', iconColor: 'text-success' },
        { icon: ArrowRight, text: 'Detailed Compatibility Score', iconColor: 'text-success' },
      ],
      buttonText: 'Check ATS Score',
      buttonLink: '/ats-checker',
      buttonBg: 'bg-gradient-to-r from-success to-emerald-600 hover:opacity-90',
      buttonTextColor: 'text-white'
    }
  ];

  return (
    // Standardized section padding
    <section className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary/5 to-accent-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-accent-pink/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Standardized badge */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">The Power to Impress</span>
          </motion.div>

          {/* Standardized H2 scale */}
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-6">
            Total Control,
            <span className="block bg-gradient-to-r from-primary via-accent-purple to-primary/80 bg-clip-text text-transparent">
              Flawless Results.
            </span>
          </h2>
          
          {/* Standardized Lead Paragraph scale */}
          <p className="text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
            Our tools give you the flexibility to create a truly personal and professional application, without the usual headaches.
          </p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="group relative h-full"
              variants={cardVariants}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Standardized Card: rounded-2xl and bg-card. Removed backdrop-blur for clarity */}
              <div className="relative bg-card rounded-2xl p-6 lg:p-8 shadow-xl border border-border h-full flex flex-col">
                {/* Standardized icon container */}
                <motion.div 
                  className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </motion.div>

                {/* Standardized H3 scale */}
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                
                {/* Standardized Body Paragraph scale */}
                <p className="text-base text-muted-foreground leading-relaxed mb-6">
                  {feature.desc}
                </p>

                <div className="space-y-3 mb-8">
                  {feature.perks.map((perk, pIndex) => (
                    <div key={pIndex} className="flex items-center gap-3">
                      <perk.icon className={`w-5 h-5 ${perk.iconColor} flex-shrink-0`} />
                      {/* Standardized feature list text */}
                      <span className="text-sm text-muted-foreground font-medium">{perk.text}</span>
                    </div>
                  ))}
                </div>

                {/* Standardized Button: rounded-xl */}
                <motion.div
                  className="mt-auto" // Pushes button to the bottom
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <NavLink 
                    to={feature.buttonLink} 
                    className={`inline-flex items-center justify-center gap-2 ${feature.buttonBg} ${feature.buttonTextColor} px-6 py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto`}
                  >
                    {feature.buttonText}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </NavLink>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
