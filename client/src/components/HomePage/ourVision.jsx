import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, BrainCircuit, UserCheck } from 'lucide-react';

const OurVision = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-muted-foreground">Our Vision</span>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            From Builder to <span className="bg-gradient-to-r from-primary via-accent-purple to-accent-pink bg-clip-text text-transparent">Career Copilot.</span>
          </h2>
          
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12">
            A great resume is just the first step. We're building a future where smart, personalized AI helps you navigate every stage of your career—from discovering your strengths to landing your dream job and beyond. Join us now and be part of the journey.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Card 1 */}
          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-border">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
              <UserCheck size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Master Your Story</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Start by perfecting your resume and cover letter with our best-in-class tools.</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-border">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
              <BrainCircuit size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Unlock Your Potential</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Soon, our AI will help you identify skill gaps and discover opportunities you never knew existed.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-border">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
              <Rocket size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Navigate Your Career</h3>
            <p className="text-sm sm:text-base text-muted-foreground">The future is an intelligent copilot that guides you toward your ultimate professional goals.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );s
};

export default OurVision;
