import React from 'react';
import { useIconContext } from '../IconContext';

const FlowerIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
  const context = useIconContext();
  const resolvedFill = fill ?? '#52B788';
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
        <linearGradient id="flowerGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Petals - outer ring */}
      <circle cx="12" cy="6" r="2.2" fill="url(#flowerGradient)" opacity="0.9" />
      <circle cx="18" cy="10" r="2.2" fill="url(#flowerGradient)" opacity="0.9" />
      <circle cx="16" cy="17" r="2.2" fill="url(#flowerGradient)" opacity="0.9" />
      <circle cx="8" cy="17" r="2.2" fill="url(#flowerGradient)" opacity="0.9" />
      <circle cx="6" cy="10" r="2.2" fill="url(#flowerGradient)" opacity="0.9" />
      {/* Center stamen */}
      <circle cx="12" cy="12.5" r="3.2" fill={resolvedFill} opacity="0.85" />
      {/* Inner center highlight */}
      <circle cx="12" cy="12.5" r="2" fill={resolvedFill} opacity="0.4" />
      {/* Stem */}
      <path
        d="M12 15.5Q11 17 12 20.5"
        stroke={resolvedFill}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
});

FlowerIcon.displayName = 'FlowerIcon';
export default FlowerIcon;
