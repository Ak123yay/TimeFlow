import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * ClockIcon - Time display and clock representation (outline only)
 */
const ClockIcon = React.memo(({
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
      {/* Clock circle outline */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
      />
      {/* Center dot */}
      <circle cx="12" cy="12" r="0.8" fill={resolvedFill} />
      {/* Hour hand */}
      <line
        x1="12"
        y1="7"
        x2="12"
        y2="11.5"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1="12"
        y1="12"
        x2="15.5"
        y2="15"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

ClockIcon.displayName = 'ClockIcon';
export default ClockIcon;
