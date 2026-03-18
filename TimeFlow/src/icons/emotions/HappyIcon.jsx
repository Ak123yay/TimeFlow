import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * HappyIcon - Happy/positive emotion (outline only)
 */
const HappyIcon = React.memo(({
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
      {/* Face outline */}
      <circle cx="12" cy="12" r="10.5" fill="none" stroke={resolvedFill} strokeWidth="1.3" />
      {/* Left eye */}
      <circle cx="9" cy="10" r="1.2" fill="none" stroke={resolvedFill} strokeWidth="1" />
      {/* Right eye */}
      <circle cx="15" cy="10" r="1.2" fill="none" stroke={resolvedFill} strokeWidth="1" />
      {/* Smile */}
      <path
        d="M8 14C9 16.5 10.5 17.5 12 17.5C13.5 17.5 15 16.5 16 14"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

HappyIcon.displayName = 'HappyIcon';
export default HappyIcon;
