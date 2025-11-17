'use client';

import { useToast } from '@/contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10b981',
          color: '#ffffff',
          icon: '✓',
        };
      case 'error':
        return {
          backgroundColor: '#ef4444',
          color: '#ffffff',
          icon: '✕',
        };
      case 'warning':
        return {
          backgroundColor: '#f59e0b',
          color: '#ffffff',
          icon: '⚠',
        };
      case 'info':
        return {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          icon: 'ℹ',
        };
      default:
        return {
          backgroundColor: '#6b7280',
          color: '#ffffff',
          icon: '•',
        };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                padding: '1rem 1.25rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                minWidth: '300px',
                maxWidth: '400px',
                pointerEvents: 'auto',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: '700', flexShrink: 0 }}>
                {styles.icon}
              </span>
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: styles.color,
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8,
                  transition: 'opacity 0.2s',
                  fontSize: '1.25rem',
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
                aria-label="Close toast"
              >
                ×
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

