import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * NutIcon - Seed and nutrition (outline only)
 */
const NutIcon = React.memo(({
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
      {/* Nut outline */}
      <ellipse cx="12" cy="12" rx="7" ry="8" fill="none" stroke={resolvedFill} strokeWidth="1.3" />
      {/* Nut detail line */}
      <path
        d="M9 10C9 9 10.5 8 12 8C13.5 8 15 9 15 10"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

NutIcon.displayName = 'NutIcon';
export default NutIcon;
