import React from 'react';
import { motion } from 'motion/react';

interface ReadingProgressBarProps {
  progress: number; // 0–100
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ progress }) => {
  if (progress <= 0) return null;

  return (
    <div
      className="fixed left-0 right-0 top-0 z-60 h-1 bg-slate-200/70 backdrop-blur dark:bg-slate-800/80"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <motion.div
        className="h-full rounded-r-full"
        style={{
          background: 'linear-gradient(90deg, #2563EB, #3B82F6, #6366F1)',
          boxShadow: '0 0 12px rgba(37, 99, 235, 0.25)',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
    </div>
  );
};
