import React, { forwardRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import generateResumeHtml from "@/utils/generateResumeHtml";

const ResumePreview = forwardRef(({ templateCode, currentFormData, spacingMultiplier }, resumeRef) => {

  const previewHtmlContent = useMemo(() => {
    if (!templateCode) {
      return '<div style="display: flex; justify-content: center; align-items: center; height: 100%; color: hsl(var(--muted-foreground)); font-family: Inter, sans-serif;">Template code not available.</div>';
    }
    return generateResumeHtml(templateCode, currentFormData, spacingMultiplier);
  }, [templateCode, currentFormData, spacingMultiplier]);

  return (
    <section
      className="w-full bg-muted/30 dark:bg-muted/20 rounded-xl border border-border shadow-inner overflow-auto p-4 md:p-6 flex justify-center items-start min-h-[calc(100vh-200px)] print:p-0 print:bg-white"
      aria-label="Resume Preview Area"
      role="region"
    >
      {/* This outer div is now the scaling container.
        It ensures that the preview scales down responsively while maintaining its aspect ratio.
        The max-w-full prevents it from overflowing its parent on very small screens.
        The 'my-auto' helps to vertically center it within the flex container.
      */}
      <div className="transform origin-top scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-100 my-auto transition-transform duration-200 ease-in-out max-w-full">
        <motion.div
          ref={resumeRef}
          className="bg-white shadow-2xl ring-1 ring-black/5" // Removed rounded-md to let inner content's border-radius show if any
          style={{ width: '794px', height: '1123px' }} // A4 dimensions at 96 DPI
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
