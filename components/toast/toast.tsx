// components/ui/toast/Toast.tsx
'use client';

import { useEffect, useState } from 'react';
import type { ToastType } from './toast-provider';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

// Map toast types to styles for easy lookup
const toastStyles = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  error: 'bg-red-500',
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle enter and exit animations
  useEffect(() => {
    // Animate in
    setIsVisible(true);

    // Set up the close handler with a delay for the exit animation
    const closeTimeout = setTimeout(() => {
      handleClose();
    }, 4500); // Start fade-out animation 500ms before it's removed

    return () => {
      clearTimeout(closeTimeout);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Allow animation to complete before calling onClose
    setTimeout(onClose, 500);
  };

  const baseClasses =
    'relative text-white py-3 px-5 rounded-lg shadow-xl transform transition-all duration-500 ease-in-out flex items-center';
  const animationClasses = isVisible
    ? 'opacity-100 translate-x-0'
    : 'opacity-0 translate-x-full';
  const typeClasses = toastStyles[type];

  // Set ARIA roles for accessibility
  const role = type === 'error' ? 'alert' : 'status';
  const ariaLive = type === 'error' ? 'assertive' : 'polite';
  
  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`${baseClasses} ${animationClasses} ${typeClasses}`}
    >
      <span className="grow">{message}</span>
      <button
        onClick={handleClose}
        className="ml-4 text-white font-bold opacity-70 hover:opacity-100 focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;