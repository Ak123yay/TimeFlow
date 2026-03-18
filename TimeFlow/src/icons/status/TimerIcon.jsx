import React from 'react';

const TimerIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
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
        <linearGradient id="timerGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Top handle/connector */}
      <line
        x1="9"
        y1="2"
        x2="15"
        y2="2"
        stroke={resolvedFill}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Main circle */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="none"
        stroke="url(#timerGradient)"
        strokeWidth="1.8"
      />
      {/* Inner circle detail */}
      <circle cx="12" cy="12" r="7.5" fill={resolvedFill} opacity="0.05" />
      {/* Time hand - hour */}
      <line
        x1="12"
        y1="6"
        x2="12"
        y2="12"
        stroke={resolvedFill}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Time hand - minute indicator */}
      <circle cx="12" cy="6" r="0.6" fill={resolvedFill} opacity="0.7" />
    </svg>
  );
});

TimerIcon.displayName = 'TimerIcon';
export default TimerIcon;
