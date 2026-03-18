import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * AlertIcon - Alert notification (outline only)
 */
const AlertIcon = React.memo(({
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
      {/* Alert circle outline */}
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
      />
      {/* Exclamation dot */}
      <circle cx="12" cy="16" r="0.8" fill={resolvedFill} />
      {/* Exclamation line */}
      <line
        x1="12"
        y1="7"
        x2="12"
        y2="14"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

AlertIcon.displayName = 'AlertIcon';
export default AlertIcon;
