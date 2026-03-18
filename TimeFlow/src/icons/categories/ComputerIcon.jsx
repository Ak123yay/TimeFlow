import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * ComputerIcon - Computer and technology work (outline only)
 */
const ComputerIcon = React.memo(({
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
      {/* Monitor frame outline */}
      <rect
        x="2.5"
        y="3.5"
        width="19"
        height="12.5"
        rx="2"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
      />
      {/* Screen content - lines representing interface */}
      <line
        x1="6"
        y1="7.5"
        x2="18"
        y2="7.5"
        stroke={resolvedFill}
        strokeWidth="0.9"
      />
      <line
        x1="6"
        y1="10"
        x2="18"
        y2="10"
        stroke={resolvedFill}
        strokeWidth="0.9"
      />
      <line
        x1="6"
        y1="12.5"
        x2="14"
        y2="12.5"
        stroke={resolvedFill}
        strokeWidth="0.9"
      />
      {/* Stand - left side outline */}
      <rect
        x="8.5"
        y="16"
        width="2"
        height="4"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
        rx="0.5"
      />
      {/* Stand - right side outline */}
      <rect
        x="13.5"
        y="16"
        width="2"
        height="4"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
        rx="0.5"
      />
      {/* Base outline */}
      <rect
        x="7"
        y="20"
        width="10"
        height="1.5"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
        rx="0.75"
      />
    </svg>
  );
});

ComputerIcon.displayName = 'ComputerIcon';
export default ComputerIcon;
