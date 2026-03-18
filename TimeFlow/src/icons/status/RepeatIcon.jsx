import React from 'react';
import { useIconContext } from '../IconContext';

const RepeatIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#8BC98B' : '#7C9A73');

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
        <linearGradient id="repeatGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Top right arrow */}
      <path
        d="M17 2L21 6L17 10"
        stroke="url(#repeatGradient)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top curved path */}
      <path
        d="M3 8C3 4.5 5.5 2 8.5 2H20"
        stroke={resolvedFill}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Bottom left arrow */}
      <path
        d="M7 22L3 18L7 14"
        stroke="url(#repeatGradient)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom curved path */}
      <path
        d="M21 16C21 19.5 18.5 22 15.5 22H4"
        stroke={resolvedFill}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
});

RepeatIcon.displayName = 'RepeatIcon';
export default RepeatIcon;
