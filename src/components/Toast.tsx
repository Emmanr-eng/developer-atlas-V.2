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
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-6 right-6 z-70 w-full max-w-sm px-4 sm:px-0"
          role="alert"
          aria-live="polite"
        >
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-4 shadow-xl backdrop-blur-xl ${
              type === 'success'
                ? 'border-emerald-200 bg-white/95 text-emerald-700 shadow-emerald-500/10 dark:border-emerald-500/20 dark:bg-slate-900/95 dark:text-emerald-300'
                : 'border-red-200 bg-white/95 text-red-700 shadow-red-500/10 dark:border-red-500/20 dark:bg-slate-900/95 dark:text-red-300'
            }`}
          >
            {type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{type === 'success' ? 'Success' : 'Attention'}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
