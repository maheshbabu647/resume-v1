import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star, Heart, Zap, Check } from 'lucide-react';

// This component remains unchanged, as it's a good self-contained animation.
const FloatingIcon = ({ Icon, className, delay = 0 }) => (
  <motion.div
    className={`absolute opacity-10 ${className} -z-10`}
    animate={{
      y: [0, -30, 0],
      rotate: [0, 10, -10, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
  >
    <Icon size={40} />
  </motion.div>
);

const HeroSection = () => {
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const stepStyles = [
    {
      card: 'bg-secondary border-primary/20',
      icon: 'bg-primary text-primary-foreground',
      title: 'Professional Templates',
      desc: 'Choose from industry-specific designs.'
    },
    {
      card: 'bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 border-accent-purple/20',
      icon: 'bg-gradient-to-br from-accent-purple to-accent-pink text-white',
      title: 'ATS-Optimized Format',
      desc: 'Pass through applicant tracking systems.'
    },
    {
      card: 'bg-success/10 border-success/20',
      icon: 'bg-success text-success-foreground',
      title: 'Instant Download',
      desc: 'Get your resume ready in minutes.'
    },
  ];

  return (
    <section className="relative bg-background overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <FloatingIcon Icon={Sparkles} className="top-20 left-20 text-primary" delay={0} />
        <FloatingIcon Icon={Star} className="top-40 right-32 text-primary" delay={1} />
        <FloatingIcon Icon={Heart} className="bottom-40 left-16 text-destructive" delay={2} />
        <FloatingIcon Icon={Zap} className="bottom-32 right-20 text-primary" delay={0.5} />
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-primary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Standardized container */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-24 lg:py-16 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div 
            className="text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              variants={fadeInVariants}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">YOUR CAREER DESERVES THE BEST</span>
            </motion.div>

            {/* Standardized H1 scale */}
            <motion.h1 
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6"
              variants={fadeInVariants}
            >
              Don't Let a Bad Resume
              <span className="block bg-gradient-to-r from-primary via-accent-purple to-accent-pink bg-clip-text text-transparent">
                Cost You a Great Job
              </span>
            </motion.h1>

            {/* Standardized Lead Paragraph scale */}
            <motion.p 
              className="text-lg text-muted-foreground sm:text-xl mb-4 max-w-2xl mx-auto lg:mx-0"
              variants={fadeInVariants}
            >
              The confidence to apply for any role is just minutes away.
            </motion.p>
            
            {/* Standardized Body Paragraph scale */}
            <motion.p 
              className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
              variants={fadeInVariants}
            >
              Our process is simple, transparent, and built for results. Go from a blank page to a professional, ATS-optimized resume you're proud of—in minutes, not hours.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={fadeInVariants}
            >
              {/* Standardized Button: rounded-xl */}
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl shadow-xl hover:shadow-primary/20 transition-all duration-300 group"
              >
                <NavLink to="/templates" className="flex items-center justify-center gap-2 text-base font-semibold">
                  Build My Interview-Winning Resume
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </NavLink>
              </Button>
            </motion.div>
            
            {/* Standardized checklist items */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-8"
              variants={fadeInVariants}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success" />
                <span className="font-medium">Flawless Professional Formatting</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success" />
                <span className="font-medium">Ready in Minutes, Not Hours</span>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground mt-4"
              variants={fadeInVariants}
            >
              <Check className="w-4 h-4 text-success" />
              <span className="font-medium">No Cost to Download Your Resume.</span>
            </motion.div>
          </motion.div>

          <motion.div 
            className="w-full max-w-md mx-auto lg:max-w-none flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.div 
              className="relative"
              variants={floatingVariants}
              animate="animate"
            >
              {/* Standardized Card: rounded-2xl and bg-card */}
              <div
                className="bg-card rounded-2xl p-6 sm:p-8 shadow-2xl border border-border/50"
              >
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">
                  Why Choose Our Builder?
                </h3>
                
                <div className="space-y-4">
                  {stepStyles.map((step, index) => (
                    <motion.div 
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-xl ${step.card}`} // Nested card: rounded-xl
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Standardized icon container */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shadow-lg ${step.icon}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-base">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="mt-6 p-3 bg-success/10 rounded-xl border border-success/20 text-center"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center justify-center gap-2 text-success">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold text-sm">100% Free - No Hidden Costs!</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
