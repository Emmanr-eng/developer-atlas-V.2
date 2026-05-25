import React from 'react';

interface SectionSkeletonProps {
  variant?: 'grid' | 'list' | 'hero' | 'form';
  label?: string;
}

const Pulse: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-900/5 dark:border-slate-800/80 dark:bg-slate-900/90 ${className}`} />
);

export const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ variant = 'grid', label }) => {
  return (
    <div className="space-y-8 py-8" aria-label={label ? `Loading ${label}` : 'Loading section'} role="status">
      <div className="space-y-4 text-center">
        <Pulse className="mx-auto h-10 w-64" />
        <Pulse className="mx-auto h-4 w-96 max-w-full" />
      </div>

      {variant === 'grid' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm shadow-slate-900/5 dark:border-slate-800/80 dark:bg-slate-900/80">
              <Pulse className="h-44 w-full" />
              <Pulse className="h-5 w-3/4" />
              <Pulse className="h-3 w-full" />
              <Pulse className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {variant === 'list' && (
        <div className="mx-auto max-w-4xl space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm shadow-slate-900/5 dark:border-slate-800/80 dark:bg-slate-900/80">
              <Pulse className="h-16 w-16 shrink-0 rounded-2xl" />
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
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <Pulse className="mx-auto h-14 w-96 max-w-full" />
          <Pulse className="mx-auto h-5 w-80 max-w-full" />
          <Pulse className="mx-auto h-12 w-40 rounded-xl" />
        </div>
      )}

      {variant === 'form' && (
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Pulse className="h-14 w-full" />
            <Pulse className="h-14 w-full" />
          </div>
          <Pulse className="h-36 w-full" />
          <Pulse className="h-14 w-full rounded-xl" />
        </div>
      )}

      <span className="sr-only">Loading...</span>
    </div>
  );
};
