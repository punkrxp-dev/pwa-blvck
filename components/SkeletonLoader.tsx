import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'rectangle';
  lines?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangle',
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-[var(--glass-bg-light)] rounded';

  switch (variant) {
    case 'card':
      return (
        <div className={`${baseClasses} glass-noise p-5 ${className}`}>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-20 h-4 bg-[var(--glass-border-light)] rounded"></div>
              <div className="w-3 h-3 bg-[var(--glass-border-light)] rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="w-3/4 h-6 bg-[var(--glass-border-light)] rounded"></div>
              <div className="w-1/2 h-4 bg-[var(--glass-border-light)] rounded"></div>
            </div>
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`${baseClasses} h-4 ${index === lines - 1 ? 'w-3/4' : 'w-full'} ${className}`}
            />
          ))}
        </div>
      );

    case 'circle':
      return (
        <div className={`${baseClasses} rounded-full ${className}`} />
      );

    case 'rectangle':
    default:
      return (
        <div className={`${baseClasses} ${className}`} />
      );
  }
};

export default SkeletonLoader;