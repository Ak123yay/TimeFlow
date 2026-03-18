import React from 'react';
import { useIconContext } from '../IconContext';

const HappyIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const resolvedSize = size;
  const resolvedFill = fill ?? '#F9C74F';

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
        <linearGradient id="happyGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* Face circle */}
      <circle cx="12" cy="12" r="10.5" fill="url(#happyGradient)" opacity="0.85" />
      {/* Inner circle accent */}
      <circle cx="12" cy="12" r="9" fill={resolvedFill} opacity="0.15" />
      {/* Left eye */}
      <circle cx="9" cy="10" r="1.8" fill="white" opacity="0.9" />
      {/* Right eye */}
      <circle cx="15" cy="10" r="1.8" fill="white" opacity="0.9" />
      {/* Left eye pupil */}
      <circle cx="9" cy="10" r="0.9" fill={resolvedFill} opacity="0.7" />
      {/* Right eye pupil */}
      <circle cx="15" cy="10" r="0.9" fill={resolvedFill} opacity="0.7" />
      {/* Smile - curved */}
      <path
        d="M8 14C9 16.5 10.5 17.5 12 17.5C13.5 17.5 15 16.5 16 14"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
});

HappyIcon.displayName = 'HappyIcon';
export default HappyIcon;
