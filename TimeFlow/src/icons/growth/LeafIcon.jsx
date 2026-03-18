import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * LeafIcon - Outlined leaf only
 */
const LeafIcon = React.memo(({
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
      {/* Leaf outline only */}
      <path
        d="M2 12C2 10.5 4 8.5 8.5 8C13.5 8 17 9 20.5 12C17 15 13.5 16 8.5 16C4 15.5 2 13.5 2 12Z"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central vein */}
      <path
        d="M4 12Q12 11 20 12"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
});

LeafIcon.displayName = 'LeafIcon';
export default LeafIcon;
