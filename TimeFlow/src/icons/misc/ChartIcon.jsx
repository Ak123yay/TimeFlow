import React from 'react';
import { useIconContext } from '../IconContext';

const ChartIcon = React.memo(({
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
      {/* Bar 1 - shortest bar */}
      <rect
        x="4"
        y="16.5"
        width="4"
        height="4"
        rx="0.6"
        stroke={resolvedFill}
        strokeWidth="1.2"
      />

      {/* Bar 2 - medium bar */}
      <rect
        x="10"
        y="12"
        width="4"
        height="8.5"
        rx="0.6"
        stroke={resolvedFill}
        strokeWidth="1.2"
      />

      {/* Bar 3 - tallest bar */}
      <rect
        x="16"
        y="6"
        width="4"
        height="14.5"
        rx="0.6"
        stroke={resolvedFill}
        strokeWidth="1.2"
      />
    </svg>
  );
});

ChartIcon.displayName = 'ChartIcon';
export default ChartIcon;
