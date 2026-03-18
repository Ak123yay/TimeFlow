import React from 'react';
import { useIconContext } from '../IconContext';

const PlantIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#6FAF6F' : '#3B6E3B');

  return (
    <svg
      className={className}
      width={resolvedSize}
      height={resolvedSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="plantGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Pot - refined */}
      <path
        d="M7.5 12H16.5V17.5C16.5 19 15.5 20 14 20H10C8.5 20 7.5 19 7.5 17.5V12Z"
        fill={resolvedFill}
        opacity="0.2"
        stroke="url(#plantGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Pot rim detail */}
      <ellipse cx="12" cy="12" rx="4.5" ry="0.8" fill={resolvedFill} opacity="0.3" />
      {/* Plant stem - curved */}
      <path
        d="M12 12Q11.5 8 12 4"
        stroke={resolvedFill}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Left leaf - refined shape */}
      <path
        d="M12 7Q8 6 6.5 8Q8 10 12 9"
        fill={resolvedFill}
        opacity="0.8"
      />
      {/* Right leaf - refined shape */}
      <path
        d="M12 7Q16 6 17.5 8Q16 10 12 9"
        fill={resolvedFill}
        opacity="0.8"
      />
      {/* Top leaf */}
      <ellipse cx="12" cy="4" rx="1.8" ry="2.5" fill={resolvedFill} opacity="0.9" />
      {/* Soil texture */}
      <line
        x1="9"
        y1="18"
        x2="15"
        y2="18"
        stroke={resolvedFill}
        strokeWidth="0.8"
        opacity="0.4"
        strokeLinecap="round"
      />
    </svg>
  );
});

PlantIcon.displayName = 'PlantIcon';
export default PlantIcon;
