// // // import React, { forwardRef, useMemo, useState, useEffect } from "react";
// // // import { motion } from "framer-motion";
// // // import generateResumeHtml from "@/utils/generateResumeHtml";

// // // const ResumePreview = forwardRef(({ 
// // //   // --- Props ---
// // //   htmlShell,
// // //   baseCss,
// // //   sections,
// // //   stylePacks,
// // //   selectedStylePackKey,
// // //   sectionOrder,
// // //   currentFormData, 
// // //   spacingMultiplier 
// // // }, resumeRef) => {

// // //   const [isOverflowing, setIsOverflowing] = useState(false);

// // //   const previewHtmlContent = useMemo(() => {
// // //     return generateResumeHtml(
// // //       htmlShell,
// // //       baseCss,
// // //       sections,
// // //       stylePacks,
// // //       selectedStylePackKey,
// // //       sectionOrder,
// // //       currentFormData,
// // //       spacingMultiplier
// // //     );
// // //   }, [
// // //     htmlShell, 
// // //     baseCss, 
// // //     sections, 
// // //     stylePacks, 
// // //     selectedStylePackKey, 
// // //     sectionOrder, 
// // //     currentFormData, 
// // //     spacingMultiplier
// // //   ]);

// // //   useEffect(() => {
// // //     const TOLERANCE_PIXELS = 10;

// // //     const timer = setTimeout(() => {
// // //       if (resumeRef.current) {
// // //         const hasOverflow = resumeRef.current.scrollHeight > (resumeRef.current.clientHeight + TOLERANCE_PIXELS);
// // //         setIsOverflowing(hasOverflow);
// // //       }
// // //     }, 100);

// // //     return () => clearTimeout(timer);
// // //   }, [previewHtmlContent, resumeRef]);


// // //   return (
// // //     <section
// // //       className="w-full bg-muted/30 dark:bg-muted/20 rounded-xl border border-border shadow-inner overflow-auto p-4 md:p-6 flex flex-col justify-center items-center min-h-[calc(100vh-200px)] print:p-0 print:bg-white"
// // //       aria-label="Resume Preview Area"
// // //       role="region"
// // //     >
// // //       {isOverflowing && (
// // //         // --- THIS IS THE UPDATED LINE ---
// // //         <div className="text-center text-sm font-medium text-amber-800 dark:text-amber-100 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3 rounded-lg mb-4 w-full max-w-xl transition-all duration-300 ease-in-out">
// // //           <strong>Heads up!</strong> Your content may extend beyond one page. Consider shortening descriptions for a cleaner print layout.
// // //         </div>
// // //       )}

// // //       <div className="transform origin-top scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-100 my-auto transition-transform duration-200 ease-in-out max-w-full">
// // //         <motion.div
// // //           ref={resumeRef}
// // //           className="bg-white shadow-2xl ring-1 ring-black/5"
// // //           style={{ width: '794px', height: '1123px' }} // A4 dimensions
// // //           initial={{ opacity: 0, y: 20 }}
// // //           animate={{ opacity: 1, y: 0 }}
// // //           transition={{ duration: 0.4, ease: "easeOut" }}
// // //           dangerouslySetInnerHTML={{ __html: previewHtmlContent }}
// // //           aria-live="polite"
// // //           aria-label="Live Resume Document Preview"
// // //           role="document"
// // //         />
// // //       </div>
// // //     </section>
// // //   );
// // // });

// // // export default ResumePreview;

// // import React, { forwardRef, useMemo, useState, useEffect } from "react";
// // import { motion } from "framer-motion";
// // import generateResumeHtml from "@/utils/generateResumeHtml";
// // import { Button } from "@/components/ui/button";
// // import { ZoomIn, ZoomOut } from "lucide-react";


// // const ResumePreview = forwardRef(({ 
// //   // --- Props ---
// //   htmlShell,
// //   baseCss,
// //   sections,
// //   stylePacks,
// //   selectedStylePackKey,
// //   sectionOrder,
// //   currentFormData, 
// //   spacingMultiplier,
// //   zoomLevel,      // <-- RECEIVE from parent
// //   setZoomLevel,   // <-- RECEIVE from parent
// // }, resumeRef) => {

// //   const [isOverflowing, setIsOverflowing] = useState(false);
// //   // REMOVED: const [zoomLevel, setZoomLevel] = useState(0.75); No longer needed here.

// //   const previewHtmlContent = useMemo(() => {
// //     return generateResumeHtml(
// //       htmlShell,
// //       baseCss,
// //       sections,
// //       stylePacks,
// //       selectedStylePackKey,
// //       sectionOrder,
// //       currentFormData,
// //       spacingMultiplier
// //     );
// //   }, [
// //     htmlShell, 
// //     baseCss, 
// //     sections, 
// //     stylePacks, 
// //     selectedStylePackKey, 
// //     sectionOrder, 
// //     currentFormData, 
// //     spacingMultiplier
// //   ]);

// //   useEffect(() => {
// //     const TOLERANCE_PIXELS = 10;
// //     const timer = setTimeout(() => {
// //       if (resumeRef.current) {
// //         const hasOverflow = resumeRef.current.scrollHeight > (resumeRef.current.clientHeight + TOLERANCE_PIXELS);
// //         setIsOverflowing(hasOverflow);
// //       }
// //     }, 100);
// //     return () => clearTimeout(timer);
// //   }, [previewHtmlContent, resumeRef, zoomLevel]);


// //   // UPDATED: Handlers now use the setZoomLevel prop from the parent
// //   const handleZoomIn = () => {
// //     setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
// //   };

// //   const handleZoomOut = () => {
// //     setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
// //   };

// //   const handleZoomReset = () => {
// //     setZoomLevel(0.75);
// //   };


// //   return (
// //     <section
// //       className="relative w-full bg-muted/30 dark:bg-muted/20 rounded-xl border border-border shadow-inner overflow-auto p-4 md:p-6 flex flex-col justify-center items-center min-h-[calc(100vh-200px)] print:p-0 print:bg-white"
// //       aria-label="Resume Preview Area"
// //       role="region"
// //     >
// //       {isOverflowing && (
// //         <div className="text-center text-sm font-medium text-amber-800 dark:text-amber-100 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3 rounded-lg mb-4 w-full max-w-xl transition-all duration-300 ease-in-out">
// //           <strong>Heads up!</strong> Your content may extend beyond one page. Consider shortening descriptions for a cleaner print layout.
// //         </div>
// //       )}
      
// //       <div 
// //         className="transform origin-top my-auto transition-transform duration-200 ease-in-out max-w-full"
// //         style={{ transform: `scale(${zoomLevel})` }}
// //       >
// //         <motion.div
// //           ref={resumeRef}
// //           className="bg-white shadow-2xl ring-1 ring-black/5"
// //           style={{ width: '794px', height: '1123px' }}
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.4, ease: "easeOut" }}
// //           dangerouslySetInnerHTML={{ __html: previewHtmlContent }}
// //           aria-live="polite"
// //           aria-label="Live Resume Document Preview"
// //           role="document"
// //         />
// //       </div>
      
// //       {/* UPDATED: The new vertical zoom controls */}
// //       <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm p-1 rounded-lg border border-border shadow-lg flex flex-col items-center gap-1 z-10">
// //           <Button variant="ghost" size="icon" onClick={handleZoomIn} aria-label="Zoom In" className="h-7 w-7">
// //               <ZoomIn className="h-4 w-4" />
// //           </Button>
// //           <Button variant="ghost" size="icon" onClick={handleZoomReset} aria-label="Reset Zoom" className="h-7 w-7 text-xs font-mono font-bold">
// //               {(zoomLevel * 100).toFixed(0)}%
// //           </Button>
// //           <Button variant="ghost" size="icon" onClick={handleZoomOut} aria-label="Zoom Out" className="h-7 w-7">
// //               <ZoomOut className="h-4 w-4" />
// //           </Button>
// //       </div>

// //     </section>
// //   );
// // });

// // export default ResumePreview;

// import React, { forwardRef, useMemo, useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import generateResumeHtml from "@/utils/generateResumeHtml";
// import { Button } from "@/components/ui/button";
// import { ZoomIn, ZoomOut } from "lucide-react";

// const ResumePreview = forwardRef(({ 
//   // --- Props ---
//   htmlShell,
//   baseCss,
//   sections,
//   stylePacks,
//   selectedStylePackKey,
//   sectionOrder,
//   currentFormData, 
//   spacingMultiplier,
//   zoomLevel,
//   setZoomLevel,
// }, resumeRef) => {

//   const [isOverflowing, setIsOverflowing] = useState(false);
//   const containerRef = useRef(null);

//   const previewHtmlContent = useMemo(() => {
//     return generateResumeHtml(
//       htmlShell, baseCss, sections, stylePacks, selectedStylePackKey, sectionOrder, currentFormData, spacingMultiplier
//     );
//   }, [htmlShell, baseCss, sections, stylePacks, selectedStylePackKey, sectionOrder, currentFormData, spacingMultiplier]);

//   // Effect to check for content overflow (multi-page warning)
//   useEffect(() => {
//     const TOLERANCE_PIXELS = 10;
//     const timer = setTimeout(() => {
//       if (resumeRef.current) {
//         const hasOverflow = resumeRef.current.scrollHeight > (resumeRef.current.clientHeight + TOLERANCE_PIXELS);
//         setIsOverflowing(hasOverflow);
//       }
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [previewHtmlContent, resumeRef, zoomLevel]);

//   // FIX: Replaced the previous useEffect with a more reliable ResizeObserver.
//   // This hook now correctly waits for the layout to be stable before calculating the initial zoom.
//   useEffect(() => {
//     const RESUME_WIDTH_PX = 794;
//     const PADDING_PX = 32; 

//     const container = containerRef.current;
//     if (!container) return;

//     // Use ResizeObserver to reliably get the container's width after it has been rendered.
//     const observer = new ResizeObserver(entries => {
//       const entry = entries[0];
//       if (entry) {
//         const containerWidth = entry.contentRect.width;
//         if (containerWidth > 0) {
//           const availableWidth = containerWidth - PADDING_PX;
//           const newZoom = availableWidth / RESUME_WIDTH_PX;
//           // Set a minimum zoom level to prevent negative or excessively small values.
//           setZoomLevel(Math.max(0.2, Math.min(newZoom, 1.0)));
//         }
//       }
//     });

//     observer.observe(container);

//     // Cleanup: Disconnect the observer when the component unmounts.
//     return () => observer.disconnect();

//   }, [setZoomLevel]);


//   const handleZoomIn = () => {
//     setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
//   };

//   const handleZoomOut = () => {
//     setZoomLevel(prev => Math.max(prev - 0.1, 0.2));
//   };
  
//   return (
//     <section
//       ref={containerRef}
//       className="relative w-full bg-muted/30 dark:bg-muted/20 rounded-xl border border-border shadow-inner overflow-hidden p-4 md:p-6 flex justify-center items-start min-h-[calc(100vh-200px)] print:p-0 print:bg-white"
//       aria-label="Resume Preview Area"
//     >
//       {isOverflowing && (
//         <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center text-sm font-medium text-amber-800 dark:text-amber-100 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3 rounded-lg w-[90%] max-w-xl transition-all duration-300 ease-in-out">
//           <strong>Heads up!</strong> Your content may extend beyond one page. Consider shortening descriptions for a cleaner print layout.
//         </div>
//       )}
      
//       <div 
//         className="transform origin-top transition-transform duration-200 ease-in-out"
//         style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
//       >
//         <motion.div
//           ref={resumeRef}
//           className="bg-white shadow-2xl ring-1 ring-black/5"
//           style={{ width: '794px', height: '1123px' }}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, ease: "easeOut" }}
//           dangerouslySetInnerHTML={{ __html: previewHtmlContent }}
//           role="document"
//         />
//       </div>
      
//       <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm p-1 rounded-lg border border-border shadow-lg flex flex-col items-center gap-1 z-10">
//           <Button variant="ghost" size="icon" onClick={handleZoomIn} aria-label="Zoom In" className="h-8 w-8">
//               <ZoomIn className="h-5 w-5" />
//           </Button>
//           <div className="text-xs font-mono font-bold text-muted-foreground select-none h-8 w-8 flex items-center justify-center">
//               {(zoomLevel * 100).toFixed(0)}%
//           </div>
//           <Button variant="ghost" size="icon" onClick={handleZoomOut} aria-label="Zoom Out" className="h-8 w-8">
//               <ZoomOut className="h-5 w-5" />
//           </Button>
//       </div>
//     </section>
//   );
// });

// export default ResumePreview;


import React, { forwardRef, useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import generateResumeHtml from "@/utils/generateResumeHtml";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

const ResumePreview = forwardRef(({ 
  // --- Props ---
  htmlShell,
  baseCss,
  sections,
  stylePacks,
  selectedStylePackKey,
  sectionOrder,
  currentFormData, 
  spacingMultiplier,
  zoomLevel,
  setZoomLevel,
}, resumeRef) => {

  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);

  const previewHtmlContent = useMemo(() => {
    return generateResumeHtml(
      htmlShell, baseCss, sections, stylePacks, selectedStylePackKey, sectionOrder, currentFormData, spacingMultiplier
    );
  }, [htmlShell, baseCss, sections, stylePacks, selectedStylePackKey, sectionOrder, currentFormData, spacingMultiplier]);

  // FIX: Simplified and corrected the overflow detection logic.
  // This now reliably checks if the content is longer than a standard A4 page.
  useEffect(() => {
    const A4_PAGE_HEIGHT_PX = 1123;
    const TOLERANCE_PIXELS = 10; // A small buffer

    const timer = setTimeout(() => {
      if (resumeRef.current) {
        // The check is now simple: is the content's full height greater than one A4 page?
        const hasOverflow = resumeRef.current.scrollHeight > (A4_PAGE_HEIGHT_PX + TOLERANCE_PIXELS);
        setIsOverflowing(hasOverflow);
      }
    }, 300); 

    return () => clearTimeout(timer);
  }, [previewHtmlContent, resumeRef]); // Dependency on content changes is sufficient.

  // Effect for dynamic zoom calculation
  useEffect(() => {
    const RESUME_WIDTH_PX = 794;
    const PADDING_PX = 32; 

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const containerWidth = entry.contentRect.width;
        if (containerWidth > 0) {
          const availableWidth = containerWidth - PADDING_PX;
          const newZoom = availableWidth / RESUME_WIDTH_PX;
          setZoomLevel(Math.max(0.2, Math.min(newZoom, 1.0)));
        }
      }
    });

    observer.observe(container);

    return () => observer.disconnect();

  }, [setZoomLevel]);


  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.2));
  };
  
  return (
    <section
      ref={containerRef}
      className="relative w-full bg-muted/30 dark:bg-muted/20 rounded-xl border border-border shadow-inner p-4 md:p-6 min-h-[calc(100vh-200px)] print:p-0 print:bg-white"
      aria-label="Resume Preview Area"
    >
      {isOverflowing && (
        <div className="text-center text-sm font-medium text-amber-800 dark:text-amber-100 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3 rounded-lg mb-4 w-full max-w-xl mx-auto">
          <strong>Heads up!</strong> Your content may extend beyond one page. Consider shortening descriptions.
        </div>
      )}
      
      <div className="flex justify-center items-start">
        <div 
          className="transform origin-top transition-transform duration-200 ease-in-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center',  height: `${1123 * zoomLevel}px` }}
        >
          <motion.div
            ref={resumeRef}
            className="bg-white shadow-2xl ring-1 ring-black/5"
            style={{ width: '794px', minHeight: '1123px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            dangerouslySetInnerHTML={{ __html: previewHtmlContent }}
            role="document"
          />
        </div>
      </div>
      
      {/* FIX: Reverted zoom controls to their original, non-responsive position */}
      <div 
        className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm p-1 rounded-lg border border-border shadow-lg flex flex-col items-center gap-1 z-10"
      >
          <Button variant="ghost" size="icon" onClick={handleZoomIn} aria-label="Zoom In" className="h-8 w-8">
              <ZoomIn className="h-5 w-5" />
          </Button>
          <div className="text-xs font-mono font-bold text-muted-foreground select-none h-8 w-8 flex items-center justify-center">
              {(zoomLevel * 100).toFixed(0)}%
          </div>
          <Button variant="ghost" size="icon" onClick={handleZoomOut} aria-label="Zoom Out" className="h-8 w-8">
              <ZoomOut className="h-5 w-5" />
          </Button>
      </div>
    </section>
  );
});

export default ResumePreview;