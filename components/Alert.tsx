import React from 'react';

interface AlertProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ message, type = 'info', onClose, className = '' }) => {
  let bgColor = 'bg-indigo-50 border-indigo-100';
  let textColor = 'text-indigo-800';
  let icon = (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
    </svg>
  );

  switch (type) {
    case 'success':
      bgColor = 'bg-emerald-50 border-emerald-100';
      textColor = 'text-emerald-800';
      icon = (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      );
      break;
    case 'warning':
      bgColor = 'bg-amber-50 border-amber-100';
      textColor = 'text-amber-800';
      icon = (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.306 2.583-1.306 3.348 0l.861 1.472A3 3 0 0114 6.574v.852c0 .991.806 1.797 1.797 1.797L17 9.223a3 3 0 010 5.554l-1.203.626c-.99.516-1.796 1.322-1.797 2.313v.852c0 .991-.806 1.797-1.797 1.797h-.852c-.99-.001-1.797-.807-2.313-1.797L10 18.257a3 3 0 01-5.554 0l-.626-1.203c-.516-.99-.807-1.796-1.797-1.797h-.852c-.991 0-1.797-.806-1.797-1.797v-.852c-.001-.991.805-1.797 1.797-1.797L3 9.223a3 3 0 010-5.554l1.203-.626c.99-.516 1.796-1.322 1.797-2.313V3.099zM10 15a1 1 0 100-2 1 1 0 000 2zm0-8a1 1 0 00-1 1v3a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
        </svg>
      );
      break;
    case 'error':
      bgColor = 'bg-rose-50 border-rose-100';
      textColor = 'text-rose-800';
      icon = (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
        </svg>
      );
      break;
  }

  return (
    <div className={`flex items-center p-4 rounded-xl border-2 ${bgColor} ${textColor} ${className} shadow-sm animate-in fade-in slide-in-from-top-4 duration-300`} role="alert">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="ml-3 text-xs font-bold uppercase tracking-wider flex-grow">
        {message}
      </div>
      {onClose && (
        <button
          type="button"
          className={`ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg hover:bg-black/5 transition-colors`}
          aria-label="Close"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;