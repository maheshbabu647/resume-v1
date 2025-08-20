import React, { forwardRef, useMemo } from "react";
import { motion } from "framer-motion";
import generateResumeHtml from "@/utils/generateResumeHtml"; // Update this path if necessary

const ResumePreview = forwardRef(({ 
  // --- NEW PROPS for the modular system ---
  htmlShell,
  baseCss,
  sections,
  stylePacks,
  selectedStylePackKey,
  sectionOrder,
  
  // --- Existing props ---
  currentFormData, 
  spacingMultiplier 
}, resumeRef) => {

  // useMemo ensures the resume is only re-assembled when a relevant piece of data changes.
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

  return (
    <section
      className="w-full bg-muted/30 dark:bg-muted/20 rounded-xl border border-border shadow-inner overflow-auto p-4 md:p-6 flex justify-center items-start min-h-[calc(100vh-200px)] print:p-0 print:bg-white"
      aria-label="Resume Preview Area"
      role="region"
    >
      {/* This outer div handles the responsive scaling of the preview. */}
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