import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * SparkIcon - Sparkle and shine effect (outline only)
 */
const SparkIcon = React.memo(({
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
      {/* Main star outline */}
      <path
        d="M12 1L14.39 7.26H21.13L16.54 11.88L18.93 18.24L12 13.62L5.07 18.24L7.46 11.88L2.87 7.26H9.61L12 1Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

SparkIcon.displayName = 'SparkIcon';
export default SparkIcon;
