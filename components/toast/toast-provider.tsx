// components/ui/toast/ToastProvider.tsx
'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import Toast from './toast';

// 1. Define the types for a single toast and the context
export type ToastType = 'info' | 'success' | 'error';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

// 2. Create the context
export const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 3. Create the provider component
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    const newToast: ToastMessage = { id, message, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Automatically remove the toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Container for the toasts to be rendered */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};