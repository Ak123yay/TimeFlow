import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * CheckmarkIcon - Indicates completed or successful status (outline only)
 */
const CheckmarkIcon = React.memo(({
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
      {/* Checkmark outline */}
      <path
        d="M8 12.5L11 15.5L17.5 8"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

CheckmarkIcon.displayName = 'CheckmarkIcon';
export default CheckmarkIcon;
