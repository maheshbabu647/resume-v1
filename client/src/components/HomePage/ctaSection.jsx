// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { NavLink } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { ArrowRight, Sparkles, Rocket, Star, Zap, Check } from 'lucide-react';

// const CtaSection = () => {

//   const pulseVariants = {
//     animate: {
//       scale: [1, 1.05, 1],
//       transition: {
//         duration: 3,
//         repeat: Infinity,
//         ease: "easeInOut"
//       }
//     }
//   };


//   const FloatingIcon = ({ Icon, className, delay = 0 }) => (
//     <motion.div
//       className={`absolute opacity-10 ${className}`}
//       animate={{
//         y: [0, -25, 0],
//         rotate: [0, 15, -15, 0],
//       }}
//       transition={{
//         duration: 8,
//         repeat: Infinity,
//         ease: "easeInOut",
//         delay
//       }}
//     >
//       <Icon size={32} />
//     </motion.div>
//   );

//   return (
//     <section id="our-vision" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 relative overflow-hidden">
//       <div className="absolute inset-0 pointer-events-none">
//         <FloatingIcon Icon={Sparkles} className="top-20 left-20 text-blue-400" delay={0} />
//         <FloatingIcon Icon={Star} className="top-32 right-24 text-purple-400" delay={1.5} />
//         <FloatingIcon Icon={Zap} className="bottom-20 right-20 text-yellow-400" delay={0.8} />
//       </div>

//       <div className="container mx-auto px-4 sm:px-6 relative z-10">
//         <div className="max-w-4xl mx-auto text-center">
          
//           <motion.h2
//             className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8, delay: 0.1 }}
//           >
//             Ready to Take the
//             <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//               Next Step?
//             </span>
//           </motion.h2>

//           <motion.p
//             className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/80 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8, delay: 0.3 }}
//           >
//             Your dream job won't wait forever. Create a professional, interview-winning resume today and start applying with confidence. This is just the beginning—join us now and be the first to experience the future of career tools.
//           </motion.p>

//           <motion.div
//             className="mb-8 sm:mb-12 lg:mb-16"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8, delay: 0.5 }}
//           >
//             <motion.div
//               className="mb-6 sm:mb-8"
//               variants={pulseVariants}
//               animate="animate"
//             >
//               <Button
//                 asChild
//                 size="lg"
//                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg xl:text-xl rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group font-bold border-0"
//               >
//                 <NavLink to="/templates" className="flex items-center gap-2 sm:gap-3">
//                   Create My Resume Free
//                   <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-2 transition-transform" />
//                 </NavLink>
//               </Button>
//             </motion.div>

//             <motion.div
//               className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-8 text-white/60 text-xs sm:text-sm"
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8, delay: 0.7 }}
//             >
//               <div className="flex items-center gap-2">
//                 <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
//                 <span>No Paywall to Download</span>
//               </div>
//               <div className="h-3 sm:h-4 w-px bg-white/20 hidden sm:block"></div>
//               <div className="flex items-center gap-2">
//                 <Zap className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
//                 <span>Ready in Minutes</span>
//               </div>
//             </motion.div>
//           </motion.div>
          
//           <motion.div
//             className="mt-8 sm:mt-12 lg:mt-16 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl min-h-[280px] sm:min-h-[320px] lg:min-h-[350px] flex flex-col justify-center"
//           >
//             <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
//               <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
//                 <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
//               </div>
//             </div>
            
//             <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-3 sm:mb-4">
//               The Future is Coming Soon
//             </h3>
            
//             <p className="text-sm sm:text-base lg:text-lg text-white/80 mb-4 sm:mb-6 max-w-2xl mx-auto">
//               Our next-generation AI resume analyzer and content writer is in development. Be the first to get access when it launches.
//             </p>
            
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CtaSection;

import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket, Star, Zap } from 'lucide-react';

const CtaSection = () => {

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

  const FloatingIcon = ({ Icon, className, delay = 0 }) => (
    <motion.div
      className={`absolute ${className} -z-10`}
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
    // Standardized padding. Using theme gradient for background.
    <section id="cta-section" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary via-accent-purple to-accent-pink relative overflow-hidden z-0">
      <div className="absolute inset-0 pointer-events-none -z-10">
        {/* Updated icon colors to be theme-consistent */}
        <FloatingIcon Icon={Sparkles} className="top-20 left-20 text-primary-foreground/10" delay={0} />
        <FloatingIcon Icon={Star} className="top-32 right-24 text-primary-foreground/10" delay={1.5} />
        <FloatingIcon Icon={Zap} className="bottom-20 right-20 text-primary-foreground/10" delay={0.8} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <motion.h2
            // Standardized H2 scale, using bold for CTA.
            className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Ready to Take the
            <span className="block">
              Next Step?
            </span>
          </motion.h2>

          <motion.p
            // Standardized Lead Paragraph scale
            className="text-lg text-primary-foreground/80 sm:text-xl mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Your dream job won't wait. Create a professional, interview-winning resume today and start applying with confidence. Join us now and be the first to experience the future of career tools.
          </motion.p>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              className="mb-6"
              variants={pulseVariants}
              animate="animate"
            >
              {/* Standardized Button: rounded-xl, sensible sizing, and strong contrast */}
              <Button
                asChild
                size="lg"
                className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary px-8 py-3 rounded-xl shadow-2xl transition-all duration-300 group font-bold text-lg"
              >
                <NavLink to="/templates" className="flex items-center gap-2">
                  Create My Resume Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </NavLink>
              </Button>
            </motion.div>

            <motion.div
              // Standardized sub-text
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-primary-foreground/70"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>No Paywall to Download</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>Ready in Minutes</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            // Standardized Card: rounded-2xl
            className="mt-16 p-6 lg:p-8 bg-primary-foreground/10 backdrop-blur-md rounded-2xl border border-primary-foreground/20 shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            
            {/* Standardized H3 scale */}
            <h3 className="text-xl md:text-2xl font-semibold text-primary-foreground mb-3">
              The Future is Coming Soon
            </h3>
            
            {/* Standardized Body Paragraph scale */}
            <p className="text-base text-primary-foreground/80 max-w-2xl mx-auto">
              Our next-generation AI resume analyzer and content writer is in development. Be the first to get access when it launches.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
