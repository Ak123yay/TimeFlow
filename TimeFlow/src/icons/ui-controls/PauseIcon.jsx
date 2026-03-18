import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * PauseIcon - Pause action (outline only)
 */
const PauseIcon = React.memo(({
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
      {/* Left pause bar outline */}
      <rect
        x="6"
        y="5"
        width="3"
        height="14"
        rx="1"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
      />
      {/* Right pause bar outline */}
      <rect
        x="15"
        y="5"
        width="3"
        height="14"
        rx="1"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
      />
    </svg>
  );
});

PauseIcon.displayName = 'PauseIcon';
export default PauseIcon;
