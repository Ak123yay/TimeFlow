import React from 'react';

const ClockIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
  const resolvedFill = fill ?? '#7C9A73';
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
        <linearGradient id="clockGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Clock circle */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="none"
        stroke="url(#clockGradient)"
        strokeWidth="1.8"
      />
      {/* Inner circle detail */}
      <circle cx="12" cy="12" r="7.5" fill={resolvedFill} opacity="0.05" />
      {/* Center dot */}
      <circle cx="12" cy="12" r="1" fill={resolvedFill} opacity="0.8" />
      {/* Hour hand */}
      <line
        x1="12"
        y1="7"
        x2="12"
        y2="11.5"
        stroke={resolvedFill}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Minute hand */}
      <line
        x1="12"
        y1="12"
        x2="15.5"
        y2="15"
        stroke={resolvedFill}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Hour markers */}
      <circle cx="12" cy="4" r="0.5" fill={resolvedFill} opacity="0.6" />
      <circle cx="18" cy="12" r="0.5" fill={resolvedFill} opacity="0.6" />
    </svg>
  );
});

ClockIcon.displayName = 'ClockIcon';
export default ClockIcon;
