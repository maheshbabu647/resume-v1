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
    const SMALL_SCREEN_BREAKPOINT = 768; // Consider screens < 768px as small
    const SMALL_SCREEN_ZOOM = 0.3; // Fixed 30% zoom for small screens

    const setInitialZoom = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      if (containerWidth > 0) {
        // For small screens, use fixed 30% zoom
        if (containerWidth < SMALL_SCREEN_BREAKPOINT) {
          if (zoomLevel === 1) {
            setZoomLevel(SMALL_SCREEN_ZOOM);
          }
        } else {
          // For larger screens, calculate zoom based on available width
          const availableWidth = containerWidth - PADDING_PX;
          const newZoom = availableWidth / RESUME_WIDTH_PX;
          const calculatedZoom = Math.max(0.2, Math.min(newZoom, 1.0));
          
          if (zoomLevel === 1) {
            setZoomLevel(calculatedZoom);
          }
        }
      }
    };

    // Set initial zoom with multiple attempts to ensure it works
    const timer1 = setTimeout(setInitialZoom, 100);
    const timer2 = setTimeout(setInitialZoom, 300);
    const timer3 = setTimeout(setInitialZoom, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [setZoomLevel, zoomLevel]);

  // Additional effect to ensure initial zoom is set correctly on mount
  useEffect(() => {
    const SMALL_SCREEN_BREAKPOINT = 768;
    const SMALL_SCREEN_ZOOM = 0.3;

    const checkAndSetInitialZoom = () => {
      const container = containerRef.current;
      
      // First check window width as a fallback
      const windowWidth = window.innerWidth;
      if (windowWidth < SMALL_SCREEN_BREAKPOINT) {
        setZoomLevel(SMALL_SCREEN_ZOOM);
        return true; // Indicate success
      }
      
      // Then check container width if available
      if (container) {
        const containerWidth = container.offsetWidth;
        if (containerWidth > 0 && containerWidth < SMALL_SCREEN_BREAKPOINT) {
          setZoomLevel(SMALL_SCREEN_ZOOM);
          return true; // Indicate success
        }
      }
      
      return false; // Indicate we need to try again
    };

    // Try multiple times with increasing delays to ensure container is ready
    let attempts = 0;
    const maxAttempts = 10;
    
    const trySetZoom = () => {
      attempts++;
      const success = checkAndSetInitialZoom();
      
      if (!success && attempts < maxAttempts) {
        // If not successful and we haven't exceeded max attempts, try again
        setTimeout(trySetZoom, 100 * attempts); // Increasing delay
      }
    };

    // Start trying immediately
    trySetZoom();

    // Also use ResizeObserver to catch when container size changes
    const container = containerRef.current;
    if (container && window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        const windowWidth = window.innerWidth;
        const containerWidth = container.offsetWidth;
        
        // Use window width as primary check, container width as secondary
        if (windowWidth < SMALL_SCREEN_BREAKPOINT || 
            (containerWidth > 0 && containerWidth < SMALL_SCREEN_BREAKPOINT)) {
          setZoomLevel(SMALL_SCREEN_ZOOM);
        }
      });
      
      resizeObserver.observe(container);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []); // Remove dependencies to run only on mount

  // Effect to handle window resize and maintain 30% zoom on small screens
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const SMALL_SCREEN_BREAKPOINT = 768;
      const SMALL_SCREEN_ZOOM = 0.3;
      
      // If screen becomes small and user hasn't manually changed zoom, set to 30%
      if (containerWidth < SMALL_SCREEN_BREAKPOINT && zoomLevel === 1) {
        setZoomLevel(SMALL_SCREEN_ZOOM);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [zoomLevel, setZoomLevel]);

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
    const SMALL_SCREEN_BREAKPOINT = 768;
    const SMALL_SCREEN_ZOOM = 0.3;
    const container = containerRef.current;
    
    if (container) {
      const containerWidth = container.offsetWidth;
      
      // For small screens, reset to 30% zoom
      if (containerWidth < SMALL_SCREEN_BREAKPOINT) {
        setZoomLevel(SMALL_SCREEN_ZOOM);
      } else {
        // For larger screens, calculate zoom based on available width
        const availableWidth = containerWidth - PADDING_PX;
        const newZoom = availableWidth / RESUME_WIDTH_PX;
        const calculatedZoom = Math.max(0.2, Math.min(newZoom, 1.0));
        setZoomLevel(calculatedZoom);
      }
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
