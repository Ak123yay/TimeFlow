import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * WarningIcon - Warning/caution indication (outline only)
 */
const WarningIcon = React.memo(({
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
      {/* Triangle warning outline */}
      <path
        d="M12 2.5L2.5 19.5H21.5L12 2.5Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
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

WarningIcon.displayName = 'WarningIcon';
export default WarningIcon;
