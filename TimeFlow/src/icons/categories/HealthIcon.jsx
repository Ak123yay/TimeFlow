import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * HealthIcon - Health and fitness (outline only)
 */
const HealthIcon = React.memo(({
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
      {/* Circle outline */}
      <circle cx="12" cy="12" r="9" fill="none" stroke={resolvedFill} strokeWidth="1.3" />
      {/* Vertical line */}
      <line
        x1="12"
        y1="6"
        x2="12"
        y2="18"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Horizontal line */}
      <line
        x1="6"
        y1="12"
        x2="18"
        y2="12"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
});

HealthIcon.displayName = 'HealthIcon';
export default HealthIcon;
