import React from 'react';

interface SectionSkeletonProps {
  variant?: 'card' | 'list' | 'hero';
  count?: number;
}

export const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ variant = 'card', count = 3 }) => {
  if (variant === 'hero') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-neutral-100 rounded-lg w-3/4"></div>
        <div className="h-4 bg-neutral-100 rounded-lg w-1/2"></div>
        <div className="h-64 bg-neutral-100 rounded-xl"></div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-16 bg-neutral-100 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-48 bg-neutral-100 rounded-xl p-6 space-y-4">
            <div className="h-4 bg-neutral-200/50 rounded w-2/3"></div>
            <div className="h-3 bg-neutral-200/50 rounded w-full"></div>
            <div className="h-3 bg-neutral-200/50 rounded w-4/5"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
