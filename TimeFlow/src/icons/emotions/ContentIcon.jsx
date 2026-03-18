import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * ContentIcon - Content and satisfaction (outline only)
 */
const ContentIcon = React.memo(({
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
      <circle cx="9" cy="10" r="1.2" fill="none" stroke={resolvedFill} strokeWidth="1" />
      {/* Right eye outline */}
      <circle cx="15" cy="10" r="1.2" fill="none" stroke={resolvedFill} strokeWidth="1" />
      {/* Flat mouth */}
      <line
        x1="9"
        y1="14"
        x2="15"
        y2="14"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

ContentIcon.displayName = 'ContentIcon';
export default ContentIcon;
