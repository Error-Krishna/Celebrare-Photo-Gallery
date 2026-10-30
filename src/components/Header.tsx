import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-[#E5E5E5] bg-[#FAFAF8]/80 backdrop-blur-sm sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Subtle geometric camera/aperture logo mark */}
          <div className="w-9 h-9 rounded-lg bg-[#171717] flex items-center justify-center text-white shadow-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" />
              <circle cx="17" cy="7" r="1" fill="currentColor" />
            </svg>
          </div>

          <div>
            <span className="text-xl font-semibold tracking-tight text-[#171717] font-serif">
              Frame
            </span>
            <span className="mx-2 text-xs text-[#A3A3A3]">•</span>
            <span className="text-xs text-[#737373] tracking-wide uppercase font-medium">
              A collection of moments.
            </span>
          </div>
        </div>

        {/* Minimal assignment tag */}
        <div className="hidden sm:flex items-center space-x-2 text-xs text-[#737373] border border-[#E5E5E5] px-3 py-1.5 rounded-full bg-white">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7]" />
          <span>Celebrare Gallery Prescreen</span>
        </div>
      </div>
    </header>
  );
};
