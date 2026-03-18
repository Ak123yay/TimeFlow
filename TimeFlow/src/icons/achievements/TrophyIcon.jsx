import React from 'react';
import { useIconContext } from '../IconContext';

const TrophyIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
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
        <linearGradient id="trophyGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* Trophy cup - refined shape */}
      <path
        d="M7 4C6.5 4 6 4.5 6 5V8C6 9 6.5 9.5 7 9.5H8C8.5 9.5 8.5 10 8 10.5L8.5 13C8.5 13 9 13.2 10 13.2V19C10 20 10.5 21 12 21C13.5 21 14 20 14 19V13.2C15 13.2 15.5 13 15.5 13L16 10.5C15.5 10 15.5 9.5 16 9.5H17C17.5 9.5 18 9 18 8V5C18 4.5 17.5 4 17 4Z"
        fill="url(#trophyGradient)"
      />
      {/* Left handle - refined */}
      <path
        d="M7 6C6 6 5 7 5 8C5 10 6 11 7.5 11"
        stroke={resolvedFill}
        strokeWidth="1.2"
        opacity="0.7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right handle - refined */}
      <path
        d="M17 6C18 6 19 7 19 8C19 10 18 11 16.5 11"
        stroke={resolvedFill}
        strokeWidth="1.2"
        opacity="0.7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Base platform */}
      <rect
        x="9"
        y="19"
        width="6"
        height="2"
        rx="1"
        fill={resolvedFill}
        opacity="0.6"
      />
    </svg>
  );
});

TrophyIcon.displayName = 'TrophyIcon';
export default TrophyIcon;
