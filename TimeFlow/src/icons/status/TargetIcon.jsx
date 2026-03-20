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
      {/* Outer ring - bold circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={resolvedFill}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Inner ring - mid circle */}
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke={resolvedFill}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Center bullseye - solid circle */}
      <circle
        cx="12"
        cy="12"
        r="2"
        fill={resolvedFill}
      />
    </svg>
  );
});

TargetIcon.displayName = 'TargetIcon';
export default TargetIcon;
