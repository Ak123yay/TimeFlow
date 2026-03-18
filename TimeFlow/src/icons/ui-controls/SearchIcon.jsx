import React from 'react';

const SearchIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
  const resolvedFill = fill ?? '#7C9A73';
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="searchGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Search circle - more refined */}
      <circle
        cx="10"
        cy="10"
        r="6.5"
        fill="none"
        stroke="url(#searchGradient)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Search handle - refined angle */}
      <line
        x1="15"
        y1="15"
        x2="21"
        y2="21"
        stroke={resolvedFill}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
});

SearchIcon.displayName = 'SearchIcon';
export default SearchIcon;
