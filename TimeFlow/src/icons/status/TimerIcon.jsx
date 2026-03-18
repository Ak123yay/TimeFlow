import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * TimerIcon - Time tracking and timer display (outline only)
 */
const TimerIcon = React.memo(({
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
      {/* Top handle/connector */}
      <line
        x1="9"
        y1="2"
        x2="15"
        y2="2"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Main circle outline */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
      />
      {/* Time hand - hour */}
      <line
        x1="12"
        y1="6"
        x2="12"
        y2="12"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

TimerIcon.displayName = 'TimerIcon';
export default TimerIcon;
