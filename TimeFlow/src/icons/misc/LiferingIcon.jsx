import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * LiferingIcon - Support and help (outline only)
 */
const LiferingIcon = React.memo(({
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
      {/* Outer circle */}
      <circle cx="12" cy="12" r="8" fill="none" stroke={resolvedFill} strokeWidth="1.3" />
      {/* Inner circle */}
      <circle cx="12" cy="12" r="4" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
      {/* Right line */}
      <line
        x1="16"
        y1="12"
        x2="20"
        y2="12"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Left line */}
      <line
        x1="4"
        y1="12"
        x2="8"
        y2="12"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Top line */}
      <line
        x1="12"
        y1="4"
        x2="12"
        y2="8"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Bottom line */}
      <line
        x1="12"
        y1="16"
        x2="12"
        y2="20"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

LiferingIcon.displayName = 'LiferingIcon';
export default LiferingIcon;
