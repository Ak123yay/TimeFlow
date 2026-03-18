import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * CloseIcon - Close/dismiss action, delete or cancel operations
 */
const CloseIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#8BC98B' : '#7C9A73');

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
      <defs>
        <linearGradient id="closeGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.2" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Background circle with gradient */}
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="url(#closeGradient)"
        stroke={resolvedFill}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* X mark - refined with better stroke */}
      <path
        d="M8.5 8.5L15.5 15.5"
        stroke={resolvedFill}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5L8.5 15.5"
        stroke={resolvedFill}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

CloseIcon.displayName = 'CloseIcon';
export default CloseIcon;
