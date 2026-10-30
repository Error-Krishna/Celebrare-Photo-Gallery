import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div
      role="alert"
      className="max-w-md mx-auto my-16 p-8 bg-white border border-[#FCA5A5] rounded-2xl shadow-xs text-center"
    >
      <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 7.5h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-[#171717] mb-1">
        Unable to Load Gallery
      </h3>
      <p className="text-sm text-[#737373] mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#171717] hover:bg-[#2D2D2D] rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#171717]"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};
