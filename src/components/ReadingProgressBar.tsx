import React from 'react';
import { motion } from 'motion/react';

interface ReadingProgressBarProps {
  progress: number;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ progress }) => {
  if (progress <= 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-60 h-0.75"
      style={{
        background: 'rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(4px)',
      }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <motion.div
        className="h-full bg-linear-to-r from-emerald-600 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
    </div>
  );
};