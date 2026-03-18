import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * StopwatchIcon - Stopwatch timer control (outline only)
 */
const StopwatchIcon = React.memo(({
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
      {/* Stopwatch circle outline */}
      <circle
        cx="12"
        cy="14"
        r="8"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
      />
      {/* Time hand */}
      <line
        x1="12"
        y1="14"
        x2="12"
        y2="10"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Left connector */}
      <line
        x1="9"
        y1="4"
        x2="9"
        y2="6"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Right connector */}
      <line
        x1="15"
        y1="4"
        x2="15"
        y2="6"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

StopwatchIcon.displayName = 'StopwatchIcon';
export default StopwatchIcon;
