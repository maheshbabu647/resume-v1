import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket, Star, Zap, Check } from 'lucide-react';

const CtaSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // The action URL from the HTML code you provided for the "AI Feature Waitlist" form
  const brevoFormActionUrl = import.meta.env.VITE_AI_WAITLIST_FORM_ACTION_URL;

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // This stops the page from redirecting
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData();
    formData.append('EMAIL', email);
    formData.append('email_address_check', '');
    formData.append('locale', 'en');

    try {
      // We send the data in 'no-cors' mode to prevent the cross-origin error
      await fetch(brevoFormActionUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors', 
      });
      
      // Since 'no-cors' mode succeeds immediately, we update the UI
      setIsSubmitted(true);

    } catch (err) {
      console.error('Error submitting email:', err);
      setError('A network error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FloatingIcon = ({ Icon, className, delay = 0 }) => (
    <motion.div
      className={`absolute opacity-10 ${className}`}
      animate={{
        y: [0, -25, 0],
        rotate: [0, 15, -15, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      <Icon size={32} />
    </motion.div>
  );

  return (
    <section id="our-vision" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <FloatingIcon Icon={Sparkles} className="top-20 left-20 text-blue-400" delay={0} />
        <FloatingIcon Icon={Star} className="top-32 right-24 text-purple-400" delay={1.5} />
        <FloatingIcon Icon={Zap} className="bottom-20 right-20 text-yellow-400" delay={0.8} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Ready to Take the
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Next Step?
            </span>
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/80 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Your dream job won't wait forever. Create a professional, interview-winning resume today and start applying with confidence. This is just the beginning—join us now and be the first to experience the future of career tools.
          </motion.p>

          <motion.div
            className="mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              className="mb-6 sm:mb-8"
              variants={pulseVariants}
              animate="animate"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg xl:text-xl rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group font-bold border-0"
              >
                <NavLink to="/templates" className="flex items-center gap-2 sm:gap-3">
                  Create My Resume Free
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform" />
                </NavLink>
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-8 text-white/60 text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                <span>No Paywall to Download</span>
              </div>
              <div className="h-3 sm:h-4 w-px bg-white/20 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                <span>Ready in Minutes</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="mt-8 sm:mt-12 lg:mt-16 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl min-h-[280px] sm:min-h-[320px] lg:min-h-[350px] flex flex-col justify-center"
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-3 sm:mb-4">
              The Future is Coming Soon
            </h3>
            
            <p className="text-sm sm:text-base lg:text-lg text-white/80 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Our next-generation AI resume analyzer and content writer is in development. Be the first to get access when it launches.
            </p>
            
            {isSubmitted ? (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                   <Check className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-400" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">You're on the list!</h4>
                <p className="text-sm sm:text-base text-white/80">We'll notify you when our AI features are ready.</p>
              </motion.div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isSubmitting}
                  className="w-full sm:w-auto sm:flex-grow px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-transparent text-white/80 border-white/40 hover:bg-white/10 hover:text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Submitting...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    'Notify Me'
                  )}
                </motion.button>
              </form>
            )}
             {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;