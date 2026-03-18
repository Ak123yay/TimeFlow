import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * AdminIcon - Administration and settings (outline only)
 */
const AdminIcon = React.memo(({
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
      {/* Table frame outline */}
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="1.5"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
      />
      {/* First row divider */}
      <line
        x1="3"
        y1="9"
        x2="21"
        y2="9"
        stroke={resolvedFill}
        strokeWidth="1.1"
      />
      {/* Second row divider */}
      <line
        x1="3"
        y1="14"
        x2="21"
        y2="14"
        stroke={resolvedFill}
        strokeWidth="1.1"
      />
      {/* Header indicator circle */}
      <circle cx="7" cy="6.5" r="1" fill={resolvedFill} />
    </svg>
  );
});

AdminIcon.displayName = 'AdminIcon';
export default AdminIcon;
