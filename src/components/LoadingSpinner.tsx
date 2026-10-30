import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="relative w-12 h-12">
        {/* Outer static ring */}
        <div className="w-12 h-12 rounded-full border-2 border-[#E5E5E5]"></div>
        {/* Animated accent ring */}
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-transparent border-t-[#6C5CE7] animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-[#737373] tracking-wide">
        Curating gallery collection...
      </p>
      <span className="sr-only">Loading photos</span>
    </div>
  );
};
