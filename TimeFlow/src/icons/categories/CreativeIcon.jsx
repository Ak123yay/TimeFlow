import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * CreativeIcon - Creative and artistic work (outline only)
 */
const CreativeIcon = React.memo(({
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
      {/* Canvas frame outline */}
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
      />
      {/* Paint dots outlines */}
      <circle cx="7" cy="18" r="2" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
      <circle cx="15" cy="10" r="2" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
      <circle cx="18" cy="5" r="2" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
    </svg>
  );
});

CreativeIcon.displayName = 'CreativeIcon';
export default CreativeIcon;
