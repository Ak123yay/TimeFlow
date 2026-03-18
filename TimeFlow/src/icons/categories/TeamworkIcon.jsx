import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * TeamworkIcon - Teamwork and collaboration (outline only)
 */
const TeamworkIcon = React.memo(({
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
      {/* Left person - head outline */}
      <circle cx="8" cy="8" r="3" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
      {/* Right person - head outline */}
      <circle cx="16" cy="8" r="3" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
      {/* Center person - head outline */}
      <circle cx="12" cy="15" r="3" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
      {/* Left person - body outline */}
      <path
        d="M8 11C5 11 3 13 3 15V20H13V15C13 13 11 11 8 11Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right person - body outline */}
      <path
        d="M16 11C19 11 21 13 21 15V20H11V15C11 13 13 11 16 11Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

TeamworkIcon.displayName = 'TeamworkIcon';
export default TeamworkIcon;
