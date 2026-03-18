import React from 'react';
import { useIconContext } from '../IconContext';

const ComputerIcon = React.memo(({
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
        <linearGradient id="computerGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Monitor frame */}
      <rect
        x="2.5"
        y="3.5"
        width="19"
        height="12.5"
        rx="2"
        fill={resolvedFill}
        opacity="0.15"
        stroke="url(#computerGradient)"
        strokeWidth="1.5"
      />
      {/* Monitor screen - inner area */}
      <rect
        x="4"
        y="5"
        width="16"
        height="9"
        rx="1"
        fill={resolvedFill}
        opacity="0.1"
      />
      {/* Screen content - lines representing interface */}
      <line
        x1="6"
        y1="7.5"
        x2="18"
        y2="7.5"
        stroke={resolvedFill}
        strokeWidth="0.8"
        opacity="0.7"
      />
      <line
        x1="6"
        y1="10"
        x2="18"
        y2="10"
        stroke={resolvedFill}
        strokeWidth="0.8"
        opacity="0.7"
      />
      <line
        x1="6"
        y1="12.5"
        x2="14"
        y2="12.5"
        stroke={resolvedFill}
        strokeWidth="0.8"
        opacity="0.7"
      />
      {/* Stand - left side */}
      <rect
        x="8.5"
        y="16"
        width="2"
        height="4"
        fill={resolvedFill}
        opacity="0.6"
        rx="0.5"
      />
      {/* Stand - right side */}
      <rect
        x="13.5"
        y="16"
        width="2"
        height="4"
        fill={resolvedFill}
        opacity="0.6"
        rx="0.5"
      />
      {/* Base */}
      <rect
        x="7"
        y="20"
        width="10"
        height="1.5"
        fill={resolvedFill}
        opacity="0.5"
        rx="0.75"
      />
    </svg>
  );
});

ComputerIcon.displayName = 'ComputerIcon';
export default ComputerIcon;
