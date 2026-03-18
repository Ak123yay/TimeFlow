import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * SearchIcon - Search functionality (outline only)
 */
const SearchIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#888' : '#999');

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
      {/* Search circle outline */}
      <circle
        cx="10"
        cy="10"
        r="6.5"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Search handle */}
      <line
        x1="15"
        y1="15"
        x2="21"
        y2="21"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
});

SearchIcon.displayName = 'SearchIcon';
export default SearchIcon;
