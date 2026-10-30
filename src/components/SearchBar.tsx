import React from 'react';

interface SearchBarProps {
  query: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resultCount?: number;
  totalCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChange,
  resultCount,
  totalCount,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-10">
      <div className="relative flex items-center">
        {/* Inline SVG search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#737373]">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={onChange}
          placeholder="Search photos by author..."
          aria-label="Search photos by author"
          className="w-full pl-11 pr-24 py-3.5 bg-white border border-[#E5E5E5] rounded-xl text-sm text-[#171717] placeholder-[#A3A3A3] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition duration-150 ease-in-out"
        />

        {/* Counter or clear indicator */}
        {query.trim().length > 0 && typeof resultCount === 'number' && (
          <div className="absolute right-3.5 flex items-center">
            <span className="text-xs font-medium text-[#737373] bg-[#FAFAF8] border border-[#E5E5E5] px-2 py-0.5 rounded-md">
              {resultCount} of {totalCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
