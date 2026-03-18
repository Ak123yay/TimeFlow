import React from 'react';
import { useIconContext } from '../IconContext';

const WaterIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#A8D8E8' : '#90E0EF');

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
        <linearGradient id="waterGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Water droplet - refined shape */}
      <path
        d="M12 2C12 2 8 7 8 12C8 16 9.9 20 12 20C14.1 20 16 16 16 12C16 7 12 2 12 2Z"
        fill="url(#waterGradient)"
        opacity="0.9"
      />
      {/* Wave detail line inside */}
      <path
        d="M10 11Q12 9 14 11"
        stroke={resolvedFill}
        strokeWidth="0.8"
        opacity="0.5"
        strokeLinecap="round"
      />
      {/* Highlight reflection */}
      <ellipse
        cx="10"
        cy="7"
        rx="1"
        ry="1.5"
        fill={resolvedFill}
        opacity="0.4"
      />
    </svg>
  );
});

WaterIcon.displayName = 'WaterIcon';
export default WaterIcon;
