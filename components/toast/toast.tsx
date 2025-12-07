
'use client';

import { useEffect, useState } from 'react';
import type { ToastType } from './toast-provider';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

// Map toast types to styles
const toastConfig = {
  info: {
    container: 'bg-[#0a0a0a]',
    text: 'text-white',
    icon: null,
  },
  success: {
    container: 'bg-[#0a0a0a]',
    text: 'text-gold-primary',
    icon: '✓', // Minimal icon
  },
  error: {
    container: 'bg-[#0a0a0a]',
    text: 'text-red-600',
    icon: '!',
  },
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle enter and exit animations
  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setIsVisible(true));

    // Set up the close handler with a delay for the exit animation
    const closeTimeout = setTimeout(() => {
      handleClose();
    }, 4500);

    return () => {
      clearTimeout(closeTimeout);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Allow animation to complete before calling onClose
    setTimeout(onClose, 500);
  };

  const style = toastConfig[type] || toastConfig.info;

  const baseClasses =
    'relative py-4 px-6 shadow-2xl transform transition-all duration-500 ease-in-out flex items-center justify-between min-w-[300px] pointer-events-auto border border-white/10';

  const animationClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 -translate-y-4'; // Slide down/up effect

  // Using inline style for backdrop blur if needed, but sticking to solid dark for minimal look

  return (
    <div
      role="alert"
      className={`${baseClasses} ${animationClasses} ${style.container}`}
    >
      <div className={`flex items-center gap-3 ${style.text}`}>
        {style.icon && <span className="text-sm">{style.icon}</span>}
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{message}</span>
      </div>
      <button
        onClick={handleClose}
        className="ml-6 text-white/20 hover:text-white transition-colors text-lg leading-none"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;