import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * StarIcon - Achievement and excellent status (outline only)
 */
const StarIcon = React.memo(({
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
      {/* Five-pointed star outline */}
      <path
        d="M12 2L15.09 10.26H23.79L17.35 15.58L19.54 23.84L12 18.52L4.46 23.84L6.65 15.58L0.21 10.26H8.91L12 2Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

StarIcon.displayName = 'StarIcon';
export default StarIcon;
