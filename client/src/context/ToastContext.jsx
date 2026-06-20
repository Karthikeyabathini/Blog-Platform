import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((toast) => {
          let bgColor = 'bg-blue-500 text-white';
          let Icon = Info;

          if (toast.type === 'success') {
            bgColor = 'bg-emerald-600 text-white';
            Icon = CheckCircle;
          } else if (toast.type === 'error') {
            bgColor = 'bg-rose-600 text-white';
            Icon = AlertCircle;
          }

          return (
            <div
              key={toast.id}
              className={`flex items-center justify-between p-4 rounded-xl shadow-xl transition-all duration-300 animate-slide-in ${bgColor}`}
              style={{
                animation: 'slideIn 0.2s ease-out forwards',
              }}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="shrink-0" />
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white hover:text-gray-200 transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Embedded slide-in animation styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
