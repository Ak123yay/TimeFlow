import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * BulbIcon - Lightbulb and ideas (outline only)
 */
const BulbIcon = React.memo(({
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
      {/* Bulb outline */}
      <path
        d="M12 3C9.24 3 7 5.24 7 8C7 10.85 8.63 13.37 11 14.84V17H13V14.84C15.37 13.37 17 10.85 17 8C17 5.24 14.76 3 12 3Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Base outline */}
      <line
        x1="9"
        y1="21"
        x2="15"
        y2="21"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

BulbIcon.displayName = 'BulbIcon';
export default BulbIcon;
