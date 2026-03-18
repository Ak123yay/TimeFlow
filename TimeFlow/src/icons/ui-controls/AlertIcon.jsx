import React from 'react';
import { useIconContext } from '../IconContext';

const AlertIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? '#FF6B6B';

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
        <linearGradient id="alertGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Alert circle with gradient fill */}
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="url(#alertGradient)"
        opacity="0.3"
        stroke={resolvedFill}
        strokeWidth="1.8"
      />
      {/* Inner circle accent for depth */}
      <circle cx="12" cy="12" r="8" fill={resolvedFill} opacity="0.1" />
      {/* Exclamation dot */}
      <circle cx="12" cy="16" r="1.3" fill={resolvedFill} opacity="0.9" />
      {/* Exclamation line */}
      <line
        x1="12"
        y1="7"
        x2="12"
        y2="14"
        stroke={resolvedFill}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
});

AlertIcon.displayName = 'AlertIcon';
export default AlertIcon;
