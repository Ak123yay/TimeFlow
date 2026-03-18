import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * DesktopIcon - Desktop computer (outline only)
 */
const DesktopIcon = React.memo(({
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
      {/* Monitor outline */}
      <path
        d="M2 4H22V14H2Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        rx="1"
      />
      {/* Stand left */}
      <line
        x1="8"
        y1="14"
        x2="10"
        y2="20"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Stand right */}
      <line
        x1="16"
        y1="14"
        x2="14"
        y2="20"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Base */}
      <line
        x1="10"
        y1="20"
        x2="14"
        y2="20"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

DesktopIcon.displayName = 'DesktopIcon';
export default DesktopIcon;
