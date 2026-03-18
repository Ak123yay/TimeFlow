import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * SadIcon - Sad/disappointed emotion (outline only)
 */
const SadIcon = React.memo(({
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
      <circle cx="12" cy="12" r="10" fill="none" stroke={resolvedFill} strokeWidth="1.3" />
      {/* Left eye */}
      <circle cx="9" cy="10" r="1.2" fill="none" stroke={resolvedFill} strokeWidth="1" />
      {/* Right eye */}
      <circle cx="15" cy="10" r="1.2" fill="none" stroke={resolvedFill} strokeWidth="1" />
      {/* Sad mouth */}
      <path
        d="M9 15C10 14 11 13 12 13C13 13 14.5 14 15 15"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

SadIcon.displayName = 'SadIcon';
export default SadIcon;
