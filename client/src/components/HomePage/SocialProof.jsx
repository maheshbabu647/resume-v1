import React from 'react';
import { motion } from 'framer-motion';
import googlelogo from '../../assets/company-logos/google-icn.svg';
import microsoftlogo from '../../assets/company-logos/microsoft-icn.svg';
import amazonlogo from '../../assets/company-logos/amazon-icn.svg';
import deloittelogo from '../../assets/company-logos/deloitte-icn.svg';
import spotifylogo from '../../assets/company-logos/spotify-icn.svg';
import { Sparkles, TrendingUp } from 'lucide-react';

const logos = [
  { name: 'Google', src: googlelogo },
  { name: 'Microsoft', src: microsoftlogo },
  { name: 'Amazon', src: amazonlogo },
  { name: 'Deloitte', src: deloittelogo },
  { name: 'Spotify', src: spotifylogo },
];

const SocialProof = () => {
  // ... (no changes to variants)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background relative overflow-hidden">
      {/* ... (no changes to background elements) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-10 w-32 h-32 bg-gradient-to-br from-primary/5 to-accent-purple/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-8 right-10 w-40 h-40 bg-gradient-to-tr from-secondary/10 to-accent-pink/5 rounded-full blur-2xl"></div>
      </div>

      {/* _// responsiveness update_: Adjusted padding for consistency with other sections */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full px-5 py-2 mb-4 shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-muted-foreground">Trusted by Professionals</span>
          </motion.div>

          {/* _// responsiveness update_: Smoothed out font scaling from mobile to desktop */}
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Join professionals at 
            <span className="bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent"> world-class companies</span>
          </h3>
          
          {/* _// responsiveness update_: Constrained max-width for better readability on large screens */}
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Our users have successfully landed roles at these industry leaders
          </p>
        </motion.div>

        {/* This grid is already perfectly responsive. No changes needed. */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 items-center justify-items-center max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {logos.map((logo, index) => (
            <motion.div 
              key={index}
              className="group relative w-full" // _// responsiveness update_: Ensured div takes full width of grid cell
              variants={logoVariants}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/5 to-accent-purple/5 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative bg-card/70 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-border shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  className="h-8 lg:h-10 w-auto mx-auto filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://placehold.co/150x40/FAFAFA/CCCCCC?text=${logo.name}`;
                  }}
                />
              </div>

              <motion.div 
                className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-3 h-3 text-success-foreground" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* This stats grid is also perfectly responsive. No changes needed. */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div 
            className="text-center bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent mb-2">
              500+
            </div>
            <div className="text-secondary-foreground font-medium">Companies</div>
            <div className="text-sm text-muted-foreground mt-1">Hiring our users</div>
          </motion.div>

          <motion.div 
            className="text-center bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-success to-green-600 bg-clip-text text-transparent mb-2">
              78%
            </div>
            <div className="text-secondary-foreground font-medium">Success Rate</div>
            <div className="text-sm text-muted-foreground mt-1">Within 30 days</div>
          </motion.div>

          <motion.div 
            className="text-center bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent mb-2">
              $125K
            </div>
            <div className="text-secondary-foreground font-medium">Avg. Salary</div>
            <div className="text-sm text-muted-foreground mt-1">Of placed candidates</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;