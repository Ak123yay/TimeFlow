import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * BoltIcon - Lightning/energy indication (outline only)
 */
const BoltIcon = React.memo(({
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
      {/* Lightning bolt outline */}
      <path
        d="M13 1L3 14H10.5L11.5 23L21 9.5H13.5L13 1Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

BoltIcon.displayName = 'BoltIcon';
export default BoltIcon;
