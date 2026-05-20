import React from 'react';
import { motion } from 'motion/react';

interface ReadingProgressBarProps {
  progress: number; // 0–100
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ progress }) => {
  if (progress <= 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-neutral-800/50"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
    </div>
  );
};
