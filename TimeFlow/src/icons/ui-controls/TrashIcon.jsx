import React from 'react';

const TrashIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
  const resolvedFill = fill ?? '#FF6B6B';
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
        <linearGradient id="trashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.85" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.65" />
        </linearGradient>
      </defs>
      {/* Top line/handle area */}
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        stroke={resolvedFill}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Handle */}
      <path
        d="M8 6V4C8 3 8.9 2 10 2H14C15.1 2 16 3 16 4V6"
        stroke={resolvedFill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Trash can body */}
      <rect
        x="4.5"
        y="6.5"
        width="15"
        height="12"
        rx="1"
        fill="url(#trashGradient)"
        stroke={resolvedFill}
        strokeWidth="1"
        opacity="0.7"
      />
      {/* Vertical lines for detail */}
      <line
        x1="9"
        y1="9"
        x2="9"
        y2="17"
        stroke={resolvedFill}
        strokeWidth="0.8"
        opacity="0.5"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="9"
        x2="12"
        y2="17"
        stroke={resolvedFill}
        strokeWidth="0.8"
        opacity="0.5"
        strokeLinecap="round"
      />
      <line
        x1="15"
        y1="9"
        x2="15"
        y2="17"
        stroke={resolvedFill}
        strokeWidth="0.8"
        opacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
});

TrashIcon.displayName = 'TrashIcon';
export default TrashIcon;
