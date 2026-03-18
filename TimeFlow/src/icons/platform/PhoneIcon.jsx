import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * PhoneIcon - Mobile phone (outline only)
 */
const PhoneIcon = React.memo(({
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
      {/* Phone outline */}
      <rect
        x="5"
        y="2"
        width="14"
        height="20"
        rx="2.5"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
      />
      {/* Home button */}
      <circle cx="12" cy="19" r="0.8" fill={resolvedFill} />
    </svg>
  );
});

PhoneIcon.displayName = 'PhoneIcon';
export default PhoneIcon;
