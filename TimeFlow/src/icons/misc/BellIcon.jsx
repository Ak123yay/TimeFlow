import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * BellIcon - Notification and alert (outline only)
 */
const BellIcon = React.memo(({
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
      {/* Bell outline */}
      <path
        d="M18.5 8C18.5 5.5 16.5 3.5 12 3.5C7.5 3.5 5.5 5.5 5.5 8C5.5 15.5 2 18 2 18H22C22 18 18.5 15.5 18.5 8Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Clapper outline */}
      <ellipse
        cx="12"
        cy="19.5"
        rx="1.2"
        ry="2.5"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
      />
    </svg>
  );
});

BellIcon.displayName = 'BellIcon';
export default BellIcon;
