import React from 'react';

const TargetIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
  const resolvedFill = fill ?? '#F9C74F';
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
      <defs>
        <linearGradient id="targetGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Outer ring - bold */}
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="2"
        opacity="0.85"
      />
      {/* Middle ring - bold */}
      <circle
        cx="12"
        cy="12"
        r="6.5"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.8"
        opacity="0.9"
      />
      {/* Center dot - bold */}
      <circle
        cx="12"
        cy="12"
        r="3.5"
        fill="url(#targetGradient)"
        opacity="0.98"
      />
      {/* Inner highlight */}
      <circle
        cx="12"
        cy="12"
        r="1.8"
        fill={resolvedFill}
        opacity="0.6"
      />
    </svg>
  );
});

TargetIcon.displayName = 'TargetIcon';
export default TargetIcon;
