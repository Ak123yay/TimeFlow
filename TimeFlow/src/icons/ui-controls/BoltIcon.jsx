import React from 'react';

const BoltIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
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
        <linearGradient id="boltGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* Lightning bolt - refined shape */}
      <path
        d="M13 1L3 14H10.5L11.5 23L21 9.5H13.5L13 1Z"
        fill="url(#boltGradient)"
        opacity="0.9"
      />
      {/* Inner highlight */}
      <path
        d="M13 3L9 12H12L11 19L16 12H14L13 3Z"
        fill={resolvedFill}
        opacity="0.3"
      />
    </svg>
  );
});

BoltIcon.displayName = 'BoltIcon';
export default BoltIcon;
