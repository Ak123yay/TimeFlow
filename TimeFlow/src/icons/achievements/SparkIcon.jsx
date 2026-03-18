import React from 'react';

const SparkIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
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
        <linearGradient id="sparkGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* Main star shape */}
      <path
        d="M12 1L14.39 7.26H21.13L16.54 11.88L18.93 18.24L12 13.62L5.07 18.24L7.46 11.88L2.87 7.26H9.61L12 1Z"
        fill="url(#sparkGradient)"
        opacity="0.95"
      />
      {/* Inner highlight for depth */}
      <path
        d="M12 4L13.5 7.5H17L14.5 9.5L15.5 13L12 10.5L8.5 13L9.5 9.5L7 7.5H10.5L12 4Z"
        fill={resolvedFill}
        opacity="0.45"
      />
      {/* Outer sparkle decorations */}
      <circle cx="8" cy="6" r="0.6" fill={resolvedFill} opacity="0.5" />
      <circle cx="16" cy="6" r="0.6" fill={resolvedFill} opacity="0.5" />
      <circle cx="6" cy="14" r="0.6" fill={resolvedFill} opacity="0.5" />
      <circle cx="18" cy="14" r="0.6" fill={resolvedFill} opacity="0.5" />
    </svg>
  );
});

SparkIcon.displayName = 'SparkIcon';
export default SparkIcon;
