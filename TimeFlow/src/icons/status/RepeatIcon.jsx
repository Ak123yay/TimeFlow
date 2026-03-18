import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * RepeatIcon - Repeat and loop (outline only)
 */
const RepeatIcon = React.memo(({
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
      {/* Top right arrow */}
      <path
        d="M17 2L21 6L17 10"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top curved path */}
      <path
        d="M3 8C3 4.5 5.5 2 8.5 2H20"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Bottom left arrow */}
      <path
        d="M7 22L3 18L7 14"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom curved path */}
      <path
        d="M21 16C21 19.5 18.5 22 15.5 22H4"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
});

RepeatIcon.displayName = 'RepeatIcon';
export default RepeatIcon;
