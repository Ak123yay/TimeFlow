import React from 'react';

const CelebrationIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
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
        <linearGradient id="celebrationGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* Background circle glow */}
      <circle cx="12" cy="12" r="10" fill={resolvedFill} opacity="0.15" />
      {/* Star - main shape */}
      <path
        d="M12 2L14.39 8.26H21.13L16.54 12.88L18.93 19.24L12 14.62L5.07 19.24L7.46 12.88L2.87 8.26H9.61L12 2Z"
        fill="url(#celebrationGradient)"
        opacity="0.95"
      />
      {/* Inner star highlight */}
      <path
        d="M12 5L13.5 8.5H17L14.5 10.5L15.5 14L12 12L8.5 14L9.5 10.5L7 8.5H10.5L12 5Z"
        fill={resolvedFill}
        opacity="0.4"
      />
    </svg>
  );
});

CelebrationIcon.displayName = 'CelebrationIcon';
export default CelebrationIcon;
