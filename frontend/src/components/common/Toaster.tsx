import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export const Toaster = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      id="toast-container"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
    />,
    document.body
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `px-4 py-3 rounded-lg shadow-lg text-white transition-all transform translate-x-0 ${
    type === 'success' ? 'bg-green-600' :
    type === 'error' ? 'bg-red-600' :
    'bg-blue-600'
  }`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};