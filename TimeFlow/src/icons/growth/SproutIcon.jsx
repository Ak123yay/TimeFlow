import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * SproutIcon - Plant growth and sprouting (outline only)
 */
const SproutIcon = React.memo(({
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
      {/* Sprout stem outline */}
      <path
        d="M12 20Q11.5 15 12 10"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* Left leaf outline */}
      <path
        d="M12 13Q8 11 6 13Q7 17 12 15"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right leaf outline */}
      <path
        d="M12 13Q16 11 18 13Q17 17 12 15"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top leaf sprouting outline */}
      <path
        d="M12 10Q10.5 6 11.5 3"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Soil line */}
      <path
        d="M8 21Q12 22 16 21"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

SproutIcon.displayName = 'SproutIcon';
export default SproutIcon;
