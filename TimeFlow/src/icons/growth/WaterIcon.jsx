import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * WaterIcon - Water and hydration (outline only)
 */
const WaterIcon = React.memo(({
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
      {/* Water droplet outline */}
      <path
        d="M12 2C12 2 8 7 8 12C8 16 9.9 20 12 20C14.1 20 16 16 16 12C16 7 12 2 12 2Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

WaterIcon.displayName = 'WaterIcon';
export default WaterIcon;
