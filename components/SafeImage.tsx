import React, { useState, useCallback } from 'react';
import logger from '../utils/logger';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  onError?: () => void;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc,
  onError,
  className = '',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Update currentSrc when src prop changes
  React.useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = useCallback(() => {
    logger.warn('Image failed to load, trying fallback', { src: currentSrc, hasFallback: !!fallbackSrc }, 'SafeImage');
    setHasError(true);
    setIsLoading(false);

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    } else {
      logger.error('Image failed to load with no fallback available', { src: currentSrc }, 'SafeImage');
      onError?.();
    }
  }, [currentSrc, fallbackSrc, onError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  if (hasError && !fallbackSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-800 text-gray-400 text-xs ${className}`}
        role="img"
        aria-label={`Failed to load: ${alt}`}
      >
        <span className="text-center">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
};

export default SafeImage;