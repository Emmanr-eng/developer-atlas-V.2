import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-cyan-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const borderColors = {
    success: 'border-cyan-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0a0a1a]/90 backdrop-blur-xl border ${borderColors[type]} shadow-2xl shadow-black/50`}
        >
          {icons[type]}
          <span className="text-sm font-medium text-slate-200">{message}</span>
          <button onClick={onClose} className="ml-2 text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
