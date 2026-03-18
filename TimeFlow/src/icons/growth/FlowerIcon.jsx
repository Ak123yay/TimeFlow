import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * FlowerIcon - Flower and bloom (outline only)
 */
const FlowerIcon = React.memo(({
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
      {/* Petals - circle outlines */}
      <circle cx="12" cy="6" r="2.2" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
      <circle cx="18" cy="10" r="2.2" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
      <circle cx="16" cy="17" r="2.2" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
      <circle cx="8" cy="17" r="2.2" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
      <circle cx="6" cy="10" r="2.2" fill="none" stroke={resolvedFill} strokeWidth="1.1" />
      {/* Center stamen */}
      <circle cx="12" cy="12.5" r="3.2" fill="none" stroke={resolvedFill} strokeWidth="1.3" />
      {/* Stem */}
      <path
        d="M12 15.5Q11 17 12 20.5"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

FlowerIcon.displayName = 'FlowerIcon';
export default FlowerIcon;
