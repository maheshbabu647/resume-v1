import React, { forwardRef, useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import generateResumeHtml from "@/utils/generateResumeHtml";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
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
  fontSizeMultiplier,
  zoomLevel,
  setZoomLevel,
  editedSections, // CHANGED: Accept the new prop
  templateFieldDefinition, // CHANGED: Accept the new prop
}, resumeRef) => {

  const [isOverflowing, setIsOverflowing] = useState(false);
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

  // Effect for dynamic zoom calculation to fit the screen (only on initial load)
  useEffect(() => {
    const RESUME_WIDTH_PX = 794;
    const PADDING_PX = 32;

    const container = containerRef.current;
    if (!container) return;

    // Only set initial zoom, don't override user's manual zoom settings
    const setInitialZoom = () => {
      const containerWidth = container.offsetWidth;
      if (containerWidth > 0) {
        const availableWidth = containerWidth - PADDING_PX;
        const newZoom = availableWidth / RESUME_WIDTH_PX;
        const calculatedZoom = Math.max(0.2, Math.min(newZoom, 1.0));
        
        // Only set zoom if it's the default value (1) to avoid overriding user's manual zoom
        if (zoomLevel === 1) {
          setZoomLevel(calculatedZoom);
        }
      }
    };

    // Set initial zoom after a short delay to ensure container is rendered
    const timer = setTimeout(setInitialZoom, 100);
    
    return () => clearTimeout(timer);
  }, [setZoomLevel, zoomLevel]);


  const handleZoomIn = () => {
    setZoomLevel(prev => {
      const newZoom = Math.min(prev + 0.1, 2.0); // Increased max zoom to 200%
      return Math.round(newZoom * 10) / 10; // Round to 1 decimal place for cleaner values
    });
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.1, 0.1); // Reduced min zoom to 10%
      return Math.round(newZoom * 10) / 10; // Round to 1 decimal place for cleaner values
    });
  };

  const handleResetZoom = () => {
    const RESUME_WIDTH_PX = 794;
    const PADDING_PX = 32;
    const container = containerRef.current;
    
    if (container) {
      const containerWidth = container.offsetWidth;
      const availableWidth = containerWidth - PADDING_PX;
      const newZoom = availableWidth / RESUME_WIDTH_PX;
      const calculatedZoom = Math.max(0.2, Math.min(newZoom, 1.0));
      setZoomLevel(calculatedZoom);
    }
  };

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
        <div className="flex justify-center">
          <div
            className="transform origin-top transition-transform duration-200 ease-in-out"
            style={{ 
              transform: `scale(${zoomLevel})`, 
              transformOrigin: 'top center', 
              height: `${1123 * zoomLevel}px`,
              width: `${794 * zoomLevel}px`
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

      <div
        className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-4 md:right-4 bg-card/80 backdrop-blur-sm p-0.5 sm:p-1 rounded-lg border border-border shadow-lg flex flex-col items-center gap-0.5 sm:gap-1 z-10 pointer-events-auto"
      >
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomIn} 
            aria-label="Zoom In" 
            className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 hover:bg-primary/10 transition-colors"
            disabled={zoomLevel >= 2.0}
          >
              <ZoomIn className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
          </Button>
          <div className="text-xs font-mono font-bold text-muted-foreground select-none h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 flex items-center justify-center">
              {(zoomLevel * 100).toFixed(0)}%
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomOut} 
            aria-label="Zoom Out" 
            className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 hover:bg-primary/10 transition-colors"
            disabled={zoomLevel <= 0.1}
          >
              <ZoomOut className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleResetZoom} 
            aria-label="Reset Zoom" 
            className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 hover:bg-primary/10 transition-colors"
            title="Reset to fit screen"
          >
              <RotateCcw className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
          </Button>
      </div>
    </section>
  );
});

export default ResumePreview;
