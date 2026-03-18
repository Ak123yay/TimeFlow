import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * StarIcon - Achievement, great/excellent status
 * Used for mood selection (great feeling) and achievement badges
 */
const StarIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#F9C74F' : '#F9C74F');

  return (
    <svg
      className={className}
      width={resolvedSize}
      height={resolvedSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Five-pointed star with golden color */}
      <path
        d="M12 2L15.09 10.26H23.79L17.35 15.58L19.54 23.84L12 18.52L4.46 23.84L6.65 15.58L0.21 10.26H8.91L12 2Z"
        fill={resolvedFill}
        opacity="0.9"
      />
      {/* Inner highlight for depth */}
      <path
        d="M12 5L14 10H19L15 13.5L16.5 18.5L12 15L7.5 18.5L9 13.5L5 10H10L12 5Z"
        fill={resolvedIsDark ? '#FFEAA7' : '#FFF8DC'}
        opacity="0.6"
      />
    </svg>
  );
});

StarIcon.displayName = 'StarIcon';
export default StarIcon;
