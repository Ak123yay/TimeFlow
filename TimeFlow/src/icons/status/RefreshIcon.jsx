import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * RefreshIcon - Refresh and reload (outline only)
 */
const RefreshIcon = React.memo(({
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
      {/* Top right path */}
      <path
        d="M3 12C3 7.03 7.03 3 12 3C15.26 3 18.062 4.94 19.38 7.7"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Bottom left path */}
      <path
        d="M21 12C21 16.97 16.97 21 12 21C8.74 21 5.938 19.06 4.62 16.3"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Top right arrow */}
      <polygon
        points="20,7.7 21,4 17,4"
        fill={resolvedFill}
        opacity="0.8"
      />
      {/* Bottom left arrow */}
      <polygon
        points="4,16.3 3,20 7,20"
        fill={resolvedFill}
        opacity="0.8"
      />
    </svg>
  );
});

RefreshIcon.displayName = 'RefreshIcon';
export default RefreshIcon;
