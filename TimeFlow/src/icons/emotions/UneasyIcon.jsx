import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * UneasyIcon - Uneasy and uncomfortable emotion (outline only)
 */
const UneasyIcon = React.memo(({
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
      {/* Left eye outline */}
      <circle cx="8.5" cy="9" r="1.2" fill="none" stroke={resolvedFill} strokeWidth="1" />
      {/* Right eye outline */}
      <circle cx="15.5" cy="9" r="1.2" fill="none" stroke={resolvedFill} strokeWidth="1" />
      {/* Worried mouth */}
      <path
        d="M10 15C10 13.5 11 13 12 13C13 13 14 13.5 14 15"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

UneasyIcon.displayName = 'UneasyIcon';
export default UneasyIcon;
