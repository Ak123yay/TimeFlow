import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * LeafFallIcon - Leaf falling down (outline only)
 */
const LeafFallIcon = React.memo(({
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
      {/* Leaf outline falling */}
      <path
        d="M12 2C12 2 8 8 8 14C8 18.4 9.79 22 12 22C14.21 22 16 18.4 16 14C16 8 12 2 12 2Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(45 12 12)"
      />
      {/* Vein detail */}
      <path
        d="M12 5V19"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
        transform="rotate(45 12 12)"
      />
    </svg>
  );
});

LeafFallIcon.displayName = 'LeafFallIcon';
export default LeafFallIcon;
