import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star, Heart, Zap } from 'lucide-react';

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
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const FloatingIcon = ({ Icon, className, delay = 0 }) => (
    <motion.div
      className={`absolute opacity-10 ${className}`}
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

  const stepStyles = [
    {
      card: 'bg-secondary border-primary/20',
      icon: 'bg-primary text-primary-foreground',
    },
    {
      card: 'bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 border-accent-purple/20',
      icon: 'bg-gradient-to-br from-accent-purple to-accent-pink text-white',
    },
    {
      card: 'bg-success/10 border-success/20',
      icon: 'bg-success text-success-foreground',
    },
  ];

  return (
    <section className="relative bg-background overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingIcon Icon={Sparkles} className="top-20 left-20 text-primary" delay={0} />
        <FloatingIcon Icon={Star} className="top-40 right-32 text-primary" delay={1} />
        <FloatingIcon Icon={Heart} className="bottom-40 left-16 text-destructive" delay={2} />
        <FloatingIcon Icon={Zap} className="bottom-32 right-20 text-primary" delay={0.5} />
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left mb-6 sm:mb-8 lg:mb-0"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 mb-4 sm:mb-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">YOUR CAREER DESERVES THE BEST</span>
            </motion.div>

            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-3 sm:mb-4 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Don't Let a Bad Resume
              <span className="block bg-gradient-to-r from-primary via-accent-purple to-accent-pink bg-clip-text text-transparent">
                Cost You a Great Job
              </span>
            </motion.h1>

            <motion.p 
              className="text-sm sm:text-base lg:text-lg xl:text-xl text-muted-foreground mb-3 sm:mb-4 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The confidence to apply for any role is just minutes away.
            </motion.p>

            <motion.p 
              className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-4 sm:mb-6 max-w-3xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Our process is simple, transparent, and built for results. Go from a blank page to a professional, ATS-optimized resume you're proud of—in minutes, not hours. We promise a perfect resume, ready for download. 
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <NavLink to="/templates" className="flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg font-semibold">
                  Build My Interview-Winning Resume
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                </NavLink>
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-center lg:justify-start gap-2 sm:gap-4 mt-3 sm:mt-4 lg:mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-success flex items-center justify-center">
                    <span className="text-success-foreground text-xs font-bold">✓</span>
                  </div>
                  <span className="font-medium">Flawless Professional Formatting</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-success flex items-center justify-center">
                    <span className="text-success-foreground text-xs font-bold">✓</span>
                  </div>
                  <span className="font-medium">Ready in Minutes, Not Hours</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-success flex items-center justify-center">
                    <span className="text-success-foreground text-xs font-bold">✓</span>
                  </div>
                  <span className="font-medium">No Cost to Download Your Resume.</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="lg:w-1/2 w-full max-w-md lg:max-w-none flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div 
                className="bg-card/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-border/50"
                variants={floatingVariants}
                animate="animate"
              >
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6 text-center">
                  Why Choose Our Resume Builder?
                </h3>
                
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {stepStyles.map((step, index) => (
                    <motion.div 
                      key={index}
                      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl ${step.card}`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base lg:text-lg shadow-lg ${step.icon}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">{["Professional Templates", "ATS-Optimized Format", "Instant Download"][index]}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">{["Choose from industry-specific designs", "Pass through applicant tracking systems", "Get your resume ready in minutes"][index]}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="mt-3 sm:mt-4 lg:mt-6 p-2 sm:p-3 lg:p-4 bg-success/10 rounded-2xl border border-success/20 text-center"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center justify-center gap-1 sm:gap-2 text-success">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span className="font-semibold text-xs sm:text-sm lg:text-base">100% Free - No Hidden Costs!</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;