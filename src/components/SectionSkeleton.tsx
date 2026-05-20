import React from 'react';

interface SectionSkeletonProps {
  variant?: 'grid' | 'list' | 'hero' | 'form';
  label?: string;
}

const Pulse: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-neutral-800/50 rounded-2xl ${className}`} />
);

export const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ variant = 'grid', label }) => {
  return (
    <div className="space-y-8 py-8" aria-label={label ? `Loading ${label}` : 'Loading section'} role="status">
      {/* Section header skeleton */}
      <div className="text-center space-y-4">
        <Pulse className="h-10 w-64 mx-auto" />
        <Pulse className="h-4 w-96 mx-auto max-w-full" />
      </div>

      {variant === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bento-card space-y-4">
              <Pulse className="h-40 w-full" />
              <Pulse className="h-5 w-3/4" />
              <Pulse className="h-3 w-full" />
              <Pulse className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {variant === 'list' && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bento-card flex gap-6 items-start">
              <Pulse className="h-16 w-16 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-3">
                <Pulse className="h-5 w-2/3" />
                <Pulse className="h-3 w-full" />
                <Pulse className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'hero' && (
        <div className="space-y-6 max-w-3xl mx-auto text-center">
          <Pulse className="h-14 w-96 mx-auto max-w-full" />
          <Pulse className="h-5 w-80 mx-auto max-w-full" />
          <Pulse className="h-12 w-40 mx-auto rounded-full" />
        </div>
      )}

      {variant === 'form' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Pulse className="h-14 w-full" />
            <Pulse className="h-14 w-full" />
          </div>
          <Pulse className="h-32 w-full" />
          <Pulse className="h-14 w-full rounded-2xl" />
        </div>
      )}

      <span className="sr-only">Loading...</span>
    </div>
  );
};
