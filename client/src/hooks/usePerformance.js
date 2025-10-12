import { useEffect } from 'react';

const usePerformance = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would require the web-vitals library
      // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
    }

    // Monitor page load performance
    const measurePerformance = () => {
      if (performance && performance.timing) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        const firstPaint = performance.getEntriesByType('paint')[0]?.startTime;

        console.log('Performance Metrics:', {
          loadTime: `${loadTime}ms`,
          domReady: `${domReady}ms`,
          firstPaint: firstPaint ? `${firstPaint}ms` : 'N/A'
        });

        // Send to analytics if needed
        if (window.gtag) {
          window.gtag('event', 'performance_metrics', {
            load_time: loadTime,
            dom_ready: domReady,
            first_paint: firstPaint
          });
        }
      }
    };

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Monitor memory usage
    if (performance.memory) {
      const logMemoryUsage = () => {
        const memory = performance.memory;
        console.log('Memory Usage:', {
          used: `${Math.round(memory.usedJSHeapSize / 1048576)}MB`,
          total: `${Math.round(memory.totalJSHeapSize / 1048576)}MB`,
          limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`
        });
      };

      // Log memory usage every 30 seconds
      const memoryInterval = setInterval(logMemoryUsage, 30000);
      
      return () => clearInterval(memoryInterval);
    }
  }, []);

  // Monitor component render performance
  const measureRender = (componentName) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
    };
  };

  return { measureRender };
};

export default usePerformance;
