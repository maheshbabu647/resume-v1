import React, { useState, useRef, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  placeholder = null,
  effect = 'blur',
  threshold = 100,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Generate responsive srcSet for better performance
  const generateSrcSet = (originalSrc) => {
    if (!originalSrc || hasError) return '';
    
    // For local images, return as is
    if (originalSrc.startsWith('/') || originalSrc.startsWith('./')) {
      return originalSrc;
    }
    
    // For external images, you could implement image optimization service
    return originalSrc;
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <LazyLoadImage
      ref={imgRef}
      src={generateSrcSet(src)}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      width={width}
      height={height}
      effect={effect}
      threshold={threshold}
      placeholder={placeholder}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default OptimizedImage;
