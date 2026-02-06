import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

export function GlobalToast() {
  const { message, type, isVisible, hideToast } = useToastStore();

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:min-w-[300px] bg-[#1f2635] border border-white/10 text-white px-6 py-4 rounded-2xl shadow-xl z-[100] flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            {type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
            {type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
            {type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
            <span className="text-sm font-medium">{message}</span>
          </div>
          <button onClick={hideToast} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}