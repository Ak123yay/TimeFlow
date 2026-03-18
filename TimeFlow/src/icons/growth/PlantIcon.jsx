import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * PlantIcon - Plant in pot (outline only)
 */
const PlantIcon = React.memo(({
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
      {/* Pot outline */}
      <path
        d="M7.5 12H16.5V17.5C16.5 19 15.5 20 14 20H10C8.5 20 7.5 19 7.5 17.5V12Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pot rim detail */}
      <line
        x1="7.5"
        y1="12"
        x2="16.5"
        y2="12"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Plant stem outline */}
      <path
        d="M12 12Q11.5 8 12 4"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Left leaf outline */}
      <path
        d="M12 7Q8 6 6.5 8Q8 10 12 9"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right leaf outline */}
      <path
        d="M12 7Q16 6 17.5 8Q16 10 12 9"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top leaf outline */}
      <ellipse cx="12" cy="4" rx="1.8" ry="2.5" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
    </svg>
  );
});

PlantIcon.displayName = 'PlantIcon';
export default PlantIcon;
