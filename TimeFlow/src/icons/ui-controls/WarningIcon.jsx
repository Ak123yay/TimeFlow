import React from 'react';
import { useIconContext } from '../IconContext';

const WarningIcon = React.memo(({
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
      <defs>
        <linearGradient id="warningGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* Triangle warning shape - refined */}
      <path
        d="M12 2.5L2.5 19.5H21.5L12 2.5Z"
        fill="url(#warningGradient)"
        stroke={resolvedFill}
        strokeWidth="0.5"
        opacity="0.8"
      />
      {/* Inner light triangle for depth */}
      <path
        d="M12 5L5 18H19L12 5Z"
        fill={resolvedFill}
        opacity="0.2"
      />
      {/* Exclamation mark - dot */}
      <circle cx="12" cy="16" r="1.2" fill={resolvedIsDark ? '#1A1F1A' : '#fff'} />
      {/* Exclamation mark - line */}
      <line
        x1="12"
        y1="7"
        x2="12"
        y2="14"
        stroke={resolvedIsDark ? '#1A1F1A' : '#fff'}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
});

WarningIcon.displayName = 'WarningIcon';
export default WarningIcon;
