import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isVisible, onClose, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-6 right-6 z-70 max-w-sm"
          role="alert"
          aria-live="polite"
        >
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 shadow-2xl backdrop-blur-md font-mono ${
              type === 'success'
                ? 'bg-arcade-green/10 border-arcade-green/40 text-arcade-green'
                : 'bg-arcade-red/10 border-arcade-red/40 text-arcade-red'
            }`}
            style={{
              boxShadow: type === 'success'
                ? '0 0 20px rgba(57, 255, 20, 0.15)'
                : '0 0 20px rgba(255, 51, 51, 0.15)'
            }}
          >
            {type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span className="text-[8px] font-bold uppercase tracking-widest">{message}</span>
            <button
              onClick={onClose}
              className="ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};