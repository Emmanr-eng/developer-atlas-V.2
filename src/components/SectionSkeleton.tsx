import React from 'react';

interface SectionSkeletonProps {
  variant?: 'card' | 'list' | 'hero';
  count?: number;
}

export const SectionSkeleton: React.FC<SectionSkeletonProps> = ({ variant = 'card', count = 3 }) => {
  if (variant === 'hero') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-cyan-500/5 rounded-2xl w-3/4 border border-cyan-500/10"></div>
        <div className="h-4 bg-cyan-500/5 rounded-xl w-1/2 border border-cyan-500/10"></div>
        <div className="h-64 bg-cyan-500/5 rounded-3xl border border-cyan-500/10"></div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-16 bg-cyan-500/5 rounded-2xl border border-cyan-500/10"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-48 bg-cyan-500/5 rounded-3xl border border-cyan-500/10 p-6 space-y-4">
            <div className="h-4 bg-cyan-500/5 rounded-xl w-2/3 border border-cyan-500/5"></div>
            <div className="h-3 bg-cyan-500/5 rounded-xl w-full border border-cyan-500/5"></div>
            <div className="h-3 bg-cyan-500/5 rounded-xl w-4/5 border border-cyan-500/5"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
