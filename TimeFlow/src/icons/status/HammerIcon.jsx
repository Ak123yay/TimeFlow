import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * HammerIcon - Tools and settings (outline only)
 */
const HammerIcon = React.memo(({
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
      {/* Hammer head outline */}
      <rect
        x="6"
        y="3"
        width="5"
        height="6"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
      />
      {/* Hammer handle outline */}
      <line
        x1="13.5"
        y1="9"
        x2="22"
        y2="17.5"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Hammer base circle outline */}
      <circle cx="8.7" cy="20" r="1.5" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
    </svg>
  );
});

HammerIcon.displayName = 'HammerIcon';
export default HammerIcon;
