import React from 'react';
import { useIconContext } from '../IconContext';

const TargetIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = ''
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
      {/* Outer ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={resolvedFill}
        strokeWidth="1.3"
        opacity="0.8"
        strokeLinecap="round"
      />

      {/* Inner ring */}
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke={resolvedFill}
        strokeWidth="1.3"
        opacity="0.8"
        strokeLinecap="round"
      />

      {/* Center dot - small circle outline */}
      <circle
        cx="12"
        cy="12"
        r="2"
        stroke={resolvedFill}
        strokeWidth="1.1"
        opacity="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
});

TargetIcon.displayName = 'TargetIcon';
export default TargetIcon;
