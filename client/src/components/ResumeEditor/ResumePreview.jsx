import React, { forwardRef, useState, useEffect, useRef, useCallback } from "react";
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
  spacingMultiplier,
  fontSizeMultiplier,
  editedSections,
  templateFieldDefinition,
}, resumeRef) => {

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  const [previewHtmlContent, setPreviewHtmlContent] = useState('');

  // Update preview content when dependencies change
  useEffect(() => {
    const newContent = generateResumeHtml(
      htmlShell, 
      baseCss, 
      sections, 
      stylePacks, 
      selectedStylePackKey, 
      sectionOrder, 
      currentFormData, 
      spacingMultiplier,
      fontSizeMultiplier,
      editedSections,
      templateFieldDefinition
    );
    setPreviewHtmlContent(newContent);
  }, [
    htmlShell, 
    baseCss, 
    sections, 
    stylePacks, 
    selectedStylePackKey, 
    sectionOrder, 
    currentFormData, 
    spacingMultiplier, 
    fontSizeMultiplier,
    editedSections,
    templateFieldDefinition
  ]);

  // Effect to check for content overflow (multi-page warning)
  useEffect(() => {
    const A4_PAGE_HEIGHT_PX = 1123;
    const TOLERANCE_PIXELS = 10; // A small buffer

    const timer = setTimeout(() => {
      if (resumeRef.current) {
        const hasOverflow = resumeRef.current.scrollHeight > (A4_PAGE_HEIGHT_PX + TOLERANCE_PIXELS);
        setIsOverflowing(hasOverflow);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [previewHtmlContent, resumeRef]);

  // Effect for responsive scaling calculation
  useEffect(() => {
    const RESUME_WIDTH_PX = 794;
    const PADDING_PX = 32;
    const MIN_SCALE = 0.15;
    const MAX_SCALE = 1.0;

    const calculateResponsiveScale = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      if (containerWidth > 0) {
        // Calculate available width (container width minus padding)
        const dynamicPadding = containerWidth < 400 ? 16 : PADDING_PX;
        const availableWidth = containerWidth - dynamicPadding;
        
        // Calculate scale to fit the resume width in available space
        const calculatedScale = availableWidth / RESUME_WIDTH_PX;
        
        // Clamp scale between min and max values
        const optimalScale = Math.max(MIN_SCALE, Math.min(calculatedScale, MAX_SCALE));
        
        setScale(optimalScale);
      }
    };

    // Calculate initial scale
    const timer1 = setTimeout(calculateResponsiveScale, 100);
    const timer2 = setTimeout(calculateResponsiveScale, 300);
    const timer3 = setTimeout(calculateResponsiveScale, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Effect to handle responsive scaling updates on container resize
  useEffect(() => {
    const RESUME_WIDTH_PX = 794;
    const PADDING_PX = 32;
    const MIN_SCALE = 0.15;
    const MAX_SCALE = 1.0;

    const container = containerRef.current;
    if (!container || !window.ResizeObserver) return;

    const resizeObserver = new ResizeObserver(() => {
      const containerWidth = container.offsetWidth;
      if (containerWidth > 0) {
        // Calculate optimal scale for current container size
        const dynamicPadding = containerWidth < 400 ? 16 : PADDING_PX;
        const availableWidth = containerWidth - dynamicPadding;
        const calculatedScale = availableWidth / RESUME_WIDTH_PX;
        const optimalScale = Math.max(MIN_SCALE, Math.min(calculatedScale, MAX_SCALE));
        
        setScale(optimalScale);
      }
    });
    
    resizeObserver.observe(container);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);




  return (
    <section
      ref={containerRef}
      className="relative w-full bg-muted/30 rounded-xl border border-border shadow-inner p-2 sm:p-4 md:p-6 min-h-[calc(100vh-200px)] print:p-0 print:bg-white"
      aria-label="Resume Preview Area"
    >
      {isOverflowing && (
        <div className="text-center text-xs sm:text-sm font-medium text-amber-800 bg-amber-100 border border-amber-300 p-2 sm:p-3 rounded-lg mb-3 sm:mb-4 w-full max-w-xl mx-auto">
          <strong>Heads up!</strong> Your content may extend beyond one page. Consider shortening descriptions.
        </div>
      )}

      <div className="w-full overflow-auto">
        <div className="flex justify-center items-start">
          <div
            className="transform transition-transform duration-200 ease-in-out"
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: 'center top', 
              height: `${1123 * scale}px`,
              width: `${794 * scale}px`
            }}
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
      </div>
    </section>
  );
});

export default ResumePreview;
