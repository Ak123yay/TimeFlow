import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * TrashIcon - Delete action (outline only)
 */
const TrashIcon = React.memo(({
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
      {/* Top line/handle area */}
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Handle outline */}
      <path
        d="M8 6V4C8 3 8.9 2 10 2H14C15.1 2 16 3 16 4V6"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Trash can body outline */}
      <rect
        x="4.5"
        y="6.5"
        width="15"
        height="12"
        rx="1"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
      />
      {/* Vertical lines for detail */}
      <line
        x1="9"
        y1="9"
        x2="9"
        y2="17"
        stroke={resolvedFill}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="9"
        x2="12"
        y2="17"
        stroke={resolvedFill}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="15"
        y1="9"
        x2="15"
        y2="17"
        stroke={resolvedFill}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
});

TrashIcon.displayName = 'TrashIcon';
export default TrashIcon;
