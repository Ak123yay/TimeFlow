import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * AppleIcon - Apple platform (outline only)
 */
const AppleIcon = React.memo(({
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
      {/* Apple outline */}
      <path
        d="M17.05 20.28c-3.87 4.05-10.02 4.3-14.34.5-4.32-3.81-4.57-10.24-.5-14.11 4.07-3.87 10.5-3.66 14.33.5"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stem outline */}
      <line
        x1="12"
        y1="2"
        x2="12"
        y2="4"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

AppleIcon.displayName = 'AppleIcon';
export default AppleIcon;
