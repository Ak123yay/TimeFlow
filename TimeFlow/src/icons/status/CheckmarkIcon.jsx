import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * CheckmarkIcon - Indicates completed or successful status
 * Represents task completion in TimeFlow
 */
const CheckmarkIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#6FAF6F' : '#52B788');

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
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="checkGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.2" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="url(#checkGradient)"
        stroke={resolvedFill}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Refined checkmark path with smooth bezier curves */}
      <path
        d="M8 12.5L11 15.5L17.5 8"
        stroke={resolvedFill}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

CheckmarkIcon.displayName = 'CheckmarkIcon';
export default CheckmarkIcon;
