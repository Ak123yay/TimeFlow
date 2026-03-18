import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * TrophyIcon - Achievement and winning status (outline only)
 */
const TrophyIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#888' : '#999');

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
      {/* Trophy cup outline */}
      <path
        d="M7 4C6.5 4 6 4.5 6 5V8C6 9 6.5 9.5 7 9.5H8C8.5 9.5 8.5 10 8 10.5L8.5 13C8.5 13 9 13.2 10 13.2V19C10 20 10.5 21 12 21C13.5 21 14 20 14 19V13.2C15 13.2 15.5 13 15.5 13L16 10.5C15.5 10 15.5 9.5 16 9.5H17C17.5 9.5 18 9 18 8V5C18 4.5 17.5 4 17 4Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left handle outline */}
      <path
        d="M7 6C6 6 5 7 5 8C5 10 6 11 7.5 11"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right handle outline */}
      <path
        d="M17 6C18 6 19 7 19 8C19 10 18 11 16.5 11"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Base platform outline */}
      <rect
        x="9"
        y="19"
        width="6"
        height="2"
        rx="1"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
      />
    </svg>
  );
});

TrophyIcon.displayName = 'TrophyIcon';
export default TrophyIcon;
