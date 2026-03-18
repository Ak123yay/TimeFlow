import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * CelebrationIcon - Celebration and success (outline only)
 */
const CelebrationIcon = React.memo(({
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
      {/* Star outline */}
      <path
        d="M12 2L14.39 8.26H21.13L16.54 12.88L18.93 19.24L12 14.62L5.07 19.24L7.46 12.88L2.87 8.26H9.61L12 2Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

CelebrationIcon.displayName = 'CelebrationIcon';
export default CelebrationIcon;
