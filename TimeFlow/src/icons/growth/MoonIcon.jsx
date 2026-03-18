import React from 'react';
import { useIconContext } from '../IconContext';

const MoonIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? '#7C4DFF';

  return (
    <svg
      className={className}
      width={resolvedSize}
      height={resolvedSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="moonGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Moon crescent - refined shape */}
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7.5 7.5 0 0 0 21 12.79Z"
        fill="url(#moonGradient)"
        opacity="0.9"
      />
      {/* Inner highlight for depth */}
      <path
        d="M19 10A7 7 0 1 1 11 3"
        stroke={resolvedFill}
        strokeWidth="0.8"
        opacity="0.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Star details */}
      <circle cx="17" cy="7" r="0.8" fill={resolvedFill} opacity="0.7" />
      <circle cx="19" cy="10" r="0.6" fill={resolvedFill} opacity="0.5" />
      <circle cx="18" cy="14" r="0.7" fill={resolvedFill} opacity="0.6" />
    </svg>
  );
});

MoonIcon.displayName = 'MoonIcon';
export default MoonIcon;
