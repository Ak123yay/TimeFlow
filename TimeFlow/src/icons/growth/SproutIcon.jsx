import React from 'react';
import { useIconContext } from '../IconContext';

const SproutIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#8BC98B' : '#52B788');

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
        <linearGradient id="sproutStemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Sprout stem - curved */}
      <path
        d="M12 20Q11.5 15 12 10"
        stroke="url(#sproutStemGradient)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Left leaf - refined shape */}
      <path
        d="M12 13Q8 11 6 13Q7 17 12 15"
        fill={resolvedFill}
        opacity="0.85"
      />
      {/* Right leaf - refined shape */}
      <path
        d="M12 13Q16 11 18 13Q17 17 12 15"
        fill={resolvedFill}
        opacity="0.85"
      />
      {/* Top leaf sprouting */}
      <path
        d="M12 10Q10.5 6 11.5 3"
        fill={resolvedFill}
        opacity="0.8"
      />
      {/* Soil - more detailed */}
      <ellipse
        cx="12"
        cy="21"
        rx="5"
        ry="2.5"
        fill={resolvedFill}
        opacity="0.3"
      />
      <path
        d="M8 21Q12 22 16 21"
        stroke={resolvedFill}
        strokeWidth="0.8"
        opacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
});

SproutIcon.displayName = 'SproutIcon';
export default SproutIcon;
