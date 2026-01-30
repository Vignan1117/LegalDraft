import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  loading = false,
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...rest
}) => {
  let baseStyles = 'px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2';
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-md shadow-slate-200 focus:ring-slate-500';
      break;
    case 'secondary':
      variantStyles = 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm focus:ring-slate-300';
      break;
    case 'danger':
      variantStyles = 'bg-rose-600 text-white hover:bg-rose-700 active:scale-95 shadow-md shadow-rose-200 focus:ring-rose-500';
      break;
  }

  const disabledStyles = (disabled || loading) ? 'opacity-40 cursor-not-allowed grayscale' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;