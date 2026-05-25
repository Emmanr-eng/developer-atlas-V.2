import React from 'react';
import { motion } from 'motion/react';

interface ReadingProgressBarProps {
  progress: number; // 0–100
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ progress }) => {
  if (progress <= 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-60 h-0.75 bg-[#1a1a2e]"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <motion.div
        className="h-full"
        style={{
          background: 'linear-gradient(90deg, #00f0ff, #ff00aa, #ffe600)',
          boxShadow: '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(255, 0, 170, 0.3)',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
    </div>
  );
};