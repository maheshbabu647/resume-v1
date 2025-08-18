// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { NavLink } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import heroImg from '../../assets/images/hero-img.jpg'; // Ensure path is correct

// const HeroSection = () => {
//   return (
//     <section
//       className="w-full bg-gradient-to-br from-background via-muted/60 to-background text-foreground overflow-hidden" // Soft gradient background
//       aria-labelledby="hero-heading"
//     >
//       <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-8">
//         <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-between gap-12 md:gap-16 lg:gap-20 py-20 md:py-28 lg:py-32 min-h-[calc(100vh-64px)]"> {/* Adjust min-height based on navbar */}
          
//           {/* Hero Text Content */}
//           <motion.header
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
//             className="flex-1 max-w-2xl space-y-6 md:space-y-8 text-center md:text-left"
//           >
//             <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-tight md:leading-snug">
//               <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent pb-2 sm:pb-3">
//                 Build Your Career
//               </span>
//               <span className="block text-foreground mt-1 sm:mt-2">with AI-Powered Resumes</span>
//             </h1>
//             <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
//               Create professional, ATS-friendly resumes in minutes. Our advanced AI tools help you craft compelling content and stand out to employers.
//             </p>
//             <motion.nav
//               aria-label="Primary actions"
//               className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4 md:pt-6"
//               initial="hidden"
//               animate="visible"
//               variants={{
//                 visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
//               }}
//             >
//               <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
//                 <Button
//                   size="lg"
//                   className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background px-8 py-3 text-base"
//                   asChild
//                 >
//                   <NavLink to="/templates" aria-label="Get Started with AI Resume Builder">
//                     Get Started <span aria-hidden="true" className="ml-1.5">→</span>
//                   </NavLink>
//                 </Button>
//               </motion.div>
//               <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="w-full sm:w-auto border-border text-foreground hover:bg-accent hover:text-accent-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background px-8 py-3 text-base"
//                   asChild
//                 >
//                   <NavLink to="/templates" aria-label="View Resume Templates">
//                     View Templates
//                   </NavLink>
//                 </Button>
//               </motion.div>
//             </motion.nav>
//           </motion.header>

//           {/* Hero Image */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: 50 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.4, type: 'spring', stiffness: 100, damping: 15 }}
//             className="flex justify-center flex-shrink-0 w-full sm:w-4/5 md:w-5/12 lg:max-w-xl xl:max-w-2xl mt-8 md:mt-0" // Adjusted widths
//             role="presentation"
//           >
//             <img
//               src={heroImg}
//               loading="eager" // Eager load for LCP
//               alt="AI Resume Builder dashboard interface showing a resume being edited with AI suggestions"
//               className="rounded-xl md:rounded-2xl shadow-2xl object-cover w-full h-auto max-h-[450px] sm:max-h-[500px] md:max-h-[550px] lg:max-h-[600px] transition-shadow duration-300 ease-in-out hover:shadow-[0_30px_90px_-20px_hsl(var(--primary)/0.25)] border border-border/10"
//             />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { NavLink } from 'react-router-dom';
// import { motion } from 'framer-motion';

// // It's highly recommended to host your own video for performance and stability.
// // This placeholder is for demonstration purposes.
// // You can find great, free background videos on sites like Pexels or Pixabay.
// const videoUrl = "https://cdn.pixabay.com/video/2021/08/23/85523-589689531.mp4";

// const HeroSection = () => {
//   return (
//     <section
//       className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center text-white overflow-hidden"
//       aria-labelledby="hero-heading"
//     >
//       {/* Video Background */}
//       <div className="absolute top-0 left-0 w-full h-full z-0">
//         <div className="absolute inset-0 bg-black/50 z-10"></div>
//         <video
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="w-full h-full object-cover"
//           poster="https://placehold.co/1920x1080/000000/FFFFFF?text=Loading..." // A poster image is good for performance
//         >
//           <source src={videoUrl} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </div>

//       {/* Hero Text Content */}
//       <div className="relative z-20 text-center px-4">
//         <motion.header
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
//           className="max-w-4xl mx-auto"
//         >
//           <h1 id="hero-heading" className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
//             Stop Applying. Start Interviewing.
//           </h1>
//           <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200 mb-8">
//             CareerForge uses AI to build expert-level, ATS-friendly resumes and cover letters that get you noticed by recruiters. Your dream job is closer than you think.
//           </p>
//         </motion.header>

//         <motion.nav
//           aria-label="Primary actions"
//           className="flex flex-col sm:flex-row gap-4 justify-center"
//           initial="hidden"
//           animate="visible"
//           variants={{
//             visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
//           }}
//         >
//           <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
//             <Button
//               size="lg"
//               className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out px-8 py-3 text-lg font-bold"
//               asChild
//             >
//               <NavLink to="/templates" aria-label="Create Your Resume for Free">
//                 Create My Resume for Free
//               </NavLink>
//             </Button>
//           </motion.div>
//           <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
//             <Button
//               size="lg"
//               variant="outline"
//               className="w-full sm:w-auto border-white/50 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out px-8 py-3 text-lg font-bold"
//               onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
//             >
//               How It Works
//             </Button>
//           </motion.div>
//         </motion.nav>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


// 'use client'; // Required for mouse-tracking hooks

// import React, { useEffect, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { NavLink } from 'react-router-dom';
// import { motion } from 'framer-motion';

// // --- CSS for all four layers of the new, on-theme background ---
// const heroSectionStyles = `
//   /* --- Main Container --- */
//   .blueprint-background {
//     position: relative;
//     background-color: #0A0A10; /* A deep, near-black blue */
//     overflow: hidden;
//   }

//   /* --- Layer 3: Digital Embers --- */
//   .ember {
//     position: absolute;
//     bottom: -50px;
//     background-color: rgba(255, 196, 100, 0.6); /* Warm amber color */
//     border-radius: 2px;
//     animation: rise 20s infinite ease-in;
//     will-change: transform, opacity;
//   }
//   @keyframes rise {
//     to {
//       transform: translateY(-120vh) rotate(360deg);
//       opacity: 0;
//     }
//   }

//   /* --- Layer 4: Interactive Spotlight --- */
//   .spotlight {
//     position: absolute;
//     height: 100%;
//     width: 100%;
//     top: 0;
//     left: 0;
//     background: radial-gradient(circle, rgba(255, 196, 100, 0.06) 0%, rgba(255, 196, 100, 0) 30%);
//     opacity: 0;
//     transition: opacity 0.3s ease-in-out;
//     will-change: opacity;
//   }
//   .blueprint-background:hover .spotlight {
//     opacity: 1;
//   }

//   /* --- Layer 1 & 2: SVG Blueprint --- */
//   .blueprint-svg {
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     width: 120%;
//     height: 120%;
//     max-width: none;
//     z-index: 0;
//     opacity: 0.3;
//   }
//   .grid-line, .ruler-line { stroke: rgba(255, 255, 255, 0.1); stroke-width: 0.5; }
//   .schematic-base { stroke: rgba(255, 255, 255, 0.15); stroke-width: 1; }
//   .schematic-live {
//     stroke: #FFC464; /* Matching amber/gold */
//     stroke-width: 1.5;
//     stroke-dasharray: 1000;
//     stroke-dashoffset: 1000;
//     animation: draw-line 15s infinite ease-in-out;
//   }
//   @keyframes draw-line {
//     50% { stroke-dashoffset: 0; }
//     100% { stroke-dashoffset: -1000; }
//   }

//   /* Stagger the drawing animation */
//   #live-line-1 { animation-delay: 0s; }
//   #live-line-2 { animation-delay: 3s; }
//   #live-line-3 { animation-delay: 6s; }
// `;

// const HeroSection = () => {
//   const sectionRef = useRef(null);

//   // --- JavaScript for Layer 4: Interactive Spotlight ---
//   useEffect(() => {
//     const section = sectionRef.current;
//     if (!section) return;

//     const handleMouseMove = (e) => {
//         const { left, top } = section.getBoundingClientRect();
//         const x = e.clientX - left;
//         const y = e.clientY - top;
//         section.style.setProperty('--mouse-x', `${x}px`);
//         section.style.setProperty('--mouse-y', `${y}px`);
//     };

//     section.addEventListener('mousemove', handleMouseMove);
//     return () => section.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   // --- JavaScript for Layer 3: Generate Embers ---
//   const embers = Array.from({ length: 50 }).map((_, i) => {
//     const size = Math.random() * 3 + 1;
//     const style = {
//       width: `${size}px`,
//       height: `${size}px`,
//       left: `${Math.random() * 100}%`,
//       animationDuration: `${Math.random() * 15 + 10}s`,
//       animationDelay: `${Math.random() * 10}s`,
//     };
//     return <div key={i} className="ember" style={style}></div>;
//   });

//   return (
//     <>
//       <style>{heroSectionStyles}</style>
      
//       <section
//         ref={sectionRef}
//         className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center text-white blueprint-background"
//         aria-labelledby="hero-heading"
//       >
//         {/* Layer 3: Digital Embers */}
//         <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">{embers}</div>

//         {/* Layer 4: Interactive Spotlight */}
//         <div className="spotlight" style={{ left: 'var(--mouse-x)', top: 'var(--mouse-y)', transform: 'translate(-50%, -50%)' }}></div>

//         {/* Layer 1 & 2: SVG Blueprint */}
//         <svg className="blueprint-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" aria-hidden="true">
//             {/* Layer 1: Grid & Rulers */}
//             <g className="grid">
//               {Array.from({ length: 60 }).map((_, i) => ( <path key={`v-${i}`} className="grid-line" d={`M ${i * 20} 0 L ${i * 20} 800`} /> ))}
//               {Array.from({ length: 40 }).map((_, i) => ( <path key={`h-${i}`} className="grid-line" d={`M 0 ${i * 20} L 1200 ${i * 20}`} /> ))}
//             </g>
//             {/* Layer 2: Schematics */}
//             <g className="schematics">
//                 {/* Static base schematics */}
//                 <path className="schematic-base" d="M 100 100 H 500 V 700 H 100 Z" fill="none" />
//                 <path className="schematic-base" d="M 120 120 H 480" fill="none" />
//                 <path className="schematic-base" d="M 120 160 H 300" fill="none" />
//                 <path className="schematic-base" d="M 120 200 H 480" fill="none" />
//                 <path className="schematic-base" d="M 120 240 H 480" fill="none" />
//                 <path className="schematic-base" d="M 700 100 H 1100 V 400 H 700 Z" fill="none" />
//                 <path className="schematic-base" d="M 720 120 H 1080" fill="none" />
//                 <circle className="schematic-base" cx="760" cy="250" r="40" fill="none" />
//                 {/* Live animated schematics */}
//                 <path id="live-line-1" className="schematic-live" d="M 500 400 Q 600 400 700 400" fill="none" />
//                 <path id="live-line-2" className="schematic-live" d="M 500 250 L 700 100" fill="none" />
//                 <path id="live-line-3" className="schematic-live" d="M 500 550 L 700 700 L 900 600" fill="none" />
//             </g>
//         </svg>

//         {/* Your content, with the highest z-index */}
//         <div className="relative z-20 text-center px-4">
//             <motion.header
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
//                 className="max-w-4xl mx-auto"
//             >
//                 <h1 id="hero-heading" className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
//                 Stop Applying. Start Interviewing.
//                 </h1>
//                 <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200 mb-8">
//                 CareerForge uses AI to build expert-level, ATS-friendly resumes and cover letters that get you noticed by recruiters. Your dream job is closer than you think.
//                 </p>
//             </motion.header>

//             <motion.nav
//                 aria-label="Primary actions"
//                 className="flex flex-col sm:flex-row gap-4 justify-center"
//                 initial="hidden"
//                 animate="visible"
//                 variants={{
//                     visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
//                 }}
//             >
//                 <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
//                 <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out px-8 py-3 text-lg font-bold" asChild>
//                     <NavLink to="/templates" aria-label="Create Your Resume for Free">Create My Resume for Free</NavLink>
//                 </Button>
//                 </motion.div>
//                 <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
//                 <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/50 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out px-8 py-3 text-lg font-bold" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
//                     How It Works
//                 </Button>
//                 </motion.div>
//             </motion.nav>
//         </div>
//       </section>
//     </>
//   );
// };

// export default HeroSection;

'use client'; // Required for hooks

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- CSS for the responsive hero section ---
const heroSectionStyles = `
  /* --- Main Container --- */
  .blueprint-background {
    position: relative;
    background-color: #0A0A10; /* A deep, near-black blue */
    overflow: hidden;
  }

  /* --- Layer 3: Digital Embers --- */
  .ember {
    position: absolute;
    bottom: -50px;
    background-color: rgba(255, 196, 100, 0.6); /* Warm amber color */
    border-radius: 2px;
    animation: rise 20s infinite ease-in;
    will-change: transform, opacity;
  }
  @keyframes rise {
    to {
      transform: translateY(-120vh) rotate(360deg);
      opacity: 0;
    }
  }

  /* --- Layer 4: Interactive Spotlight (Desktop Only) --- */
  .spotlight {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: radial-gradient(circle, rgba(255, 196, 100, 0.06) 0%, rgba(255, 196, 100, 0) 30%);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    will-change: opacity;
  }
  .blueprint-background:hover .spotlight {
    opacity: 1;
  }

  /* --- Layer 1 & 2: SVG Blueprint --- */
  .blueprint-svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    max-width: none;
    z-index: 0;
    opacity: 0.3;
  }
  .grid-line, .ruler-line { stroke: rgba(255, 255, 255, 0.1); stroke-width: 0.5; }
  .schematic-base { stroke: rgba(255, 255, 255, 0.15); stroke-width: 1; }
  .schematic-live {
    stroke: #FFC464; /* Matching amber/gold */
    stroke-width: 1.5;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: draw-line 15s infinite ease-in-out;
  }
  @keyframes draw-line {
    50% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -1000; }
  }

  /* Stagger the drawing animation */
  #live-line-1 { animation-delay: 0s; }
  #live-line-2 { animation-delay: 3s; }
  #live-line-3 { animation-delay: 6s; }
`;

const HeroSection = () => {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // --- Check for mobile device on component mount ---
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- JavaScript for Layer 4: Interactive Spotlight (Desktop Only) ---
  useEffect(() => {
    // Only run this effect if it's not a mobile device
    if (isMobile) return;

    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e) => {
      const { left, top } = section.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      section.style.setProperty('--mouse-x', `${x}px`);
      section.style.setProperty('--mouse-y', `${y}px`);
    };

    section.addEventListener('mousemove', handleMouseMove);
    return () => section.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]); // Re-run effect if isMobile changes

  // --- JavaScript for Layer 3: Generate Embers (Fewer on mobile) ---
  const emberCount = isMobile ? 15 : 50; // Drastically reduce particle count on mobile
  const embers = Array.from({ length: emberCount }).map((_, i) => {
    const size = Math.random() * 3 + 1;
    const style = {
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 15 + 10}s`,
      animationDelay: `${Math.random() * 10}s`,
    };
    return <div key={i} className="ember" style={style}></div>;
  });

  return (
    <>
      <style>{heroSectionStyles}</style>
      
      <section
        ref={sectionRef}
        className="w-full min-h-screen flex items-center justify-center text-white blueprint-background"
        aria-labelledby="hero-heading"
      >
        {/* Layer 3: Digital Embers */}
        <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">{embers}</div>

        {/* Layer 4: Interactive Spotlight (Conditionally Rendered) */}
        {!isMobile && (
          <div className="spotlight" style={{ left: 'var(--mouse-x)', top: 'var(--mouse-y)', transform: 'translate(-50%, -50%)' }}></div>
        )}

        {/* Layer 1 & 2: SVG Blueprint (Conditionally Rendered for performance) */}
        {!isMobile && (
            <svg className="blueprint-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" aria-hidden="true">
                {/* Grid & Rulers */}
                <g className="grid">
                  {Array.from({ length: 60 }).map((_, i) => ( <path key={`v-${i}`} className="grid-line" d={`M ${i * 20} 0 L ${i * 20} 800`} /> ))}
                  {Array.from({ length: 40 }).map((_, i) => ( <path key={`h-${i}`} className="grid-line" d={`M 0 ${i * 20} L 1200 ${i * 20}`} /> ))}
                </g>
                {/* Schematics */}
                <g className="schematics">
                    <path className="schematic-base" d="M 100 100 H 500 V 700 H 100 Z" fill="none" />
                    <path className="schematic-base" d="M 120 120 H 480" fill="none" />
                    <path className="schematic-base" d="M 120 160 H 300" fill="none" />
                    <path className="schematic-base" d="M 120 200 H 480" fill="none" />
                    <path className="schematic-base" d="M 120 240 H 480" fill="none" />
                    <path className="schematic-base" d="M 700 100 H 1100 V 400 H 700 Z" fill="none" />
                    <path className="schematic-base" d="M 720 120 H 1080" fill="none" />
                    <circle className="schematic-base" cx="760" cy="250" r="40" fill="none" />
                    <path id="live-line-1" className="schematic-live" d="M 500 400 Q 600 400 700 400" fill="none" />
                    <path id="live-line-2" className="schematic-live" d="M 500 250 L 700 100" fill="none" />
                    <path id="live-line-3" className="schematic-live" d="M 500 550 L 700 700 L 900 600" fill="none" />
                </g>
            </svg>
        )}

        {/* Your content, with the highest z-index */}
        <div className="relative z-20 text-center px-4">
            <motion.header
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="max-w-4xl mx-auto"
            >
                {/* Responsive text sizes */}
                <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
                Stop Applying. Start Interviewing.
                </h1>
                <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-gray-200 mb-8">
                CareerForge uses AI to build expert-level, ATS-friendly resumes and cover letters that get you noticed by recruiters. Your dream job is closer than you think.
                </p>
            </motion.header>

            <motion.nav
                aria-label="Primary actions"
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
                }}
            >
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out px-8 py-3 text-lg font-bold" asChild>
                    <NavLink to="/templates" aria-label="Create Your Resume for Free">Create My Resume for Free</NavLink>
                </Button>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/50 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out px-8 py-3 text-lg font-bold" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                    How It Works
                </Button>
                </motion.div>
            </motion.nav>
        </div>
      </section>
    </>
  );
};

export default HeroSection;