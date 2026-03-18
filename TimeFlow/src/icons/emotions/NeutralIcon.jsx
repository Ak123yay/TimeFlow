import React from 'react';

const NeutralIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
  const resolvedFill = fill ?? '#8B7355';
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
        <linearGradient id="neutralGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.65" />
        </linearGradient>
      </defs>
      {/* Face circle */}
      <circle cx="12" cy="12" r="10.5" fill="url(#neutralGradient)" opacity="0.8" />
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
      {/* Straight mouth line */}
      <line
        x1="9"
        y1="15.5"
        x2="15"
        y2="15.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
});

NeutralIcon.displayName = 'NeutralIcon';
export default NeutralIcon;
