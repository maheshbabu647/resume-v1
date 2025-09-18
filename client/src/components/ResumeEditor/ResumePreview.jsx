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
  editedSections, // CHANGED: Accept the new prop
  templateFieldDefinition, // CHANGED: Accept the new prop
}, resumeRef) => {

  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);

  const previewHtmlContent = useMemo(() => {
    // Pass the new props to the generator function
    return generateResumeHtml(
      htmlShell, 
      baseCss, 
      sections, 
      stylePacks, 
      selectedStylePackKey, 
      sectionOrder, 
      currentFormData, 
      spacingMultiplier,
      editedSections, // CHANGED: Pass down
      templateFieldDefinition // CHANGED: Pass down
    );
  }, [
    htmlShell, 
    baseCss, 
    sections, 
    stylePacks, 
    selectedStylePackKey, 
    sectionOrder, 
    currentFormData, 
    spacingMultiplier, 
    editedSections, // CHANGED: Add to dependency array
    templateFieldDefinition // CHANGED: Add to dependency array
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

  // Effect for dynamic zoom calculation to fit the screen
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
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', height: `${1123 * zoomLevel}px` }}
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
