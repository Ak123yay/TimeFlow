import React from 'react';
import { useIconContext } from '../IconContext';

const BellIcon = React.memo(({
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
        <linearGradient id="bellGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* Bell curve - bold */}
      <path
        d="M18.5 8C18.5 5.5 16.5 3.5 12 3.5C7.5 3.5 5.5 5.5 5.5 8C5.5 15.5 2 18 2 18H22C22 18 18.5 15.5 18.5 8Z"
        fill="url(#bellGradient)"
        opacity="0.95"
        stroke={resolvedFill}
        strokeWidth="0.8"
        strokeOpacity="0.6"
      />
      {/* Bell inner highlight */}
      <path
        d="M17 8C17 6 15.5 4.5 12 4.5C8.5 4.5 7 6 7 8C7 14 4.5 16 4.5 16.5H19.5C19.5 16 17 14 17 8Z"
        fill={resolvedFill}
        opacity="0.25"
      />
      {/* Clapper - bold */}
      <ellipse
        cx="12"
        cy="19.5"
        rx="1.2"
        ry="2.5"
        fill={resolvedFill}
        opacity="0.95"
      />
      {/* Clapper highlight */}
      <ellipse cx="11.5" cy="18.5" rx="0.5" ry="1" fill={resolvedFill} opacity="0.4" />
    </svg>
  );
});

BellIcon.displayName = 'BellIcon';
export default BellIcon;
