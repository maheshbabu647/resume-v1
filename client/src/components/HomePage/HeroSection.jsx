// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { NavLink } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const HeroSection = () => {
//   // Array for the 3-step process to keep the code clean
//   const steps = [
//     {
//       emoji: '📄',
//       text: 'Pick Template',
//     },
//     {
//       emoji: '✍️',
//       text: 'Enter Details',
//     },
//     {
//       emoji: '🚀',
//       text: 'Download & Apply',
//     },
//   ];

//   return (
//     <section
//       className="relative w-full bg-gray-900 text-white overflow-hidden"
//       aria-labelledby="hero-heading"
//     >
//       {/* Subtle Radial Gradient Background */}
//       <div className="absolute inset-0 z-0 opacity-40">
//         <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
//         <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
//       </div>

//       <div className="relative z-10 container mx-auto max-w-7xl px-6 md:px-12 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16 min-h-screen py-24 lg:py-0">
          
//           {/* Left Column: Content */}
//           <motion.div
//             className="text-center lg:text-left"
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//           >
//             <header className="max-w-2xl mx-auto lg:mx-0">
//               <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
//                 Your First Job Starts with the <span className="text-primary">Right Resume</span>
//               </h1>
//               <p className="mt-6 text-lg md:text-xl text-gray-300">
//                 No confusing editors. No hidden fees. Just clean, recruiter-approved resumes built for fresh graduates.
//               </p>
//               <p className="mt-4 text-sm tracking-wider uppercase text-amber-300/80">
//                 Stand out. Get noticed. Start your career.
//               </p>
//             </header>
            
//             <motion.nav
//               aria-label="Primary actions"
//               className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
//               initial="hidden"
//               animate="visible"
//               variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
//             >
//               <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
//                 <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out px-8 py-3 text-lg font-bold" asChild>
//                   <NavLink to="/templates" aria-label="Create Your Free Resume">Create My Free Resume</NavLink>
//                 </Button>
//               </motion.div>

//             </motion.nav>
//           </motion.div>

//           {/* Right Column: 3-Step Process */}
//           <motion.div
//             className="w-full max-w-md mx-auto"
//             initial={{ opacity: 0, x: 30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
//           >
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
//               <div className="relative">
//                 {/* Vertical connecting line */}
//                 <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/20" aria-hidden="true"></div>

//                 <div className="space-y-8">
//                   {steps.map((step, index) => (
//                     <div key={index} className="flex items-center gap-6 relative">
//                       <div className="flex-shrink-0 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-xl z-10">
//                         {step.emoji}
//                       </div>
//                       <span className="text-lg font-semibold text-gray-100">{step.text}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
// ADDED: New icons for the banner and button
import { CheckCircle, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  // Array for the 3-step process to keep the code clean
  const steps = [
    {
      emoji: '📄',
      text: 'Pick Template',
    },
    {
      emoji: '✍️',
      text: 'Enter Details',
    },
    {
      emoji: '🚀',
      text: 'Download & Apply',
    },
  ];

  return (
    <section
      className="relative w-full bg-gray-900 text-white overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Subtle Radial Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-6 md:px-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16 min-h-screen py-24 lg:py-0">
          
          {/* Left Column: Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <header className="max-w-2xl mx-auto lg:mx-0">
              {/* ADDED: "100% Free" banner */}
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-gray-200 backdrop-blur-sm">
                  <CheckCircle size={16} className="mr-2 text-green-400" />
                  100% Free • No Hidden Costs
                </span>
              </div>
              
              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Your First Job Starts with the <span className="text-primary">Right Resume</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-300">
                No confusing editors. No hidden fees. Just clean, recruiter-approved resumes built for fresh graduates.
              </p>
              <p className="mt-4 text-sm tracking-wider uppercase text-amber-300/80">
                Stand out. Get noticed. Start your career.
              </p>
            </header>
            
            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {/* UPDATED: Enhanced CTA Button */}
              <Button 
                size="lg" 
                className="group relative w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/40 transform hover:scale-105 transition-all duration-300 ease-in-out px-8 py-3 text-lg font-bold overflow-hidden" 
                asChild
              >
                <NavLink to="/templates" aria-label="Create Your Free Resume">
                  {/* Shimmer effect on hover */}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/30 opacity-40 group-hover:animate-shimmer" />
                  
                  <span className="relative flex items-center">
                    Create My Free Resume
                    <ArrowRight size={20} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </NavLink>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column: 3-Step Process */}
          <motion.div
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/20" aria-hidden="true"></div>
                <div className="space-y-8">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-6 relative">
                      <div className="flex-shrink-0 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-xl z-10">
                        {step.emoji}
                      </div>
                      <span className="text-lg font-semibold text-gray-100">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;