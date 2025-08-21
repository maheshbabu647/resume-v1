import React, { forwardRef, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import generateResumeHtml from "@/utils/generateResumeHtml";

const ResumePreview = forwardRef(({ 
  // --- Props ---
  htmlShell,
  baseCss,
  sections,
  stylePacks,
  selectedStylePackKey,
  sectionOrder,
  currentFormData, 
  spacingMultiplier 
}, resumeRef) => {

  const [isOverflowing, setIsOverflowing] = useState(false);

  const previewHtmlContent = useMemo(() => {
    return generateResumeHtml(
      htmlShell,
      baseCss,
      sections,
      stylePacks,
      selectedStylePackKey,
      sectionOrder,
      currentFormData,
      spacingMultiplier
    );
  }, [
    htmlShell, 
    baseCss, 
    sections, 
    stylePacks, 
    selectedStylePackKey, 
    sectionOrder, 
    currentFormData, 
    spacingMultiplier
  ]);

  useEffect(() => {
    const TOLERANCE_PIXELS = 10;

    const timer = setTimeout(() => {
      if (resumeRef.current) {
        const hasOverflow = resumeRef.current.scrollHeight > (resumeRef.current.clientHeight + TOLERANCE_PIXELS);
        setIsOverflowing(hasOverflow);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [previewHtmlContent, resumeRef]);


  return (
    <section
      className="w-full bg-muted/30 dark:bg-muted/20 rounded-xl border border-border shadow-inner overflow-auto p-4 md:p-6 flex flex-col justify-center items-center min-h-[calc(100vh-200px)] print:p-0 print:bg-white"
      aria-label="Resume Preview Area"
      role="region"
    >
      {isOverflowing && (
        // --- THIS IS THE UPDATED LINE ---
        <div className="text-center text-sm font-medium text-amber-800 dark:text-amber-100 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-3 rounded-lg mb-4 w-full max-w-xl transition-all duration-300 ease-in-out">
          <strong>Heads up!</strong> Your content may extend beyond one page. Consider shortening descriptions for a cleaner print layout.
        </div>
      )}

      <div className="transform origin-top scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-100 my-auto transition-transform duration-200 ease-in-out max-w-full">
        <motion.div
          ref={resumeRef}
          className="bg-white shadow-2xl ring-1 ring-black/5"
          style={{ width: '794px', height: '1123px' }} // A4 dimensions
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          dangerouslySetInnerHTML={{ __html: previewHtmlContent }}
          aria-live="polite"
          aria-label="Live Resume Document Preview"
          role="document"
        />
      </div>
    </section>
  );
});

export default ResumePreview;