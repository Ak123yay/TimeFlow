import React from 'react';
import { useIconContext } from '../IconContext';

const FireIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? '#FF4500';

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
        <linearGradient id="fireGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FF6B47" stopOpacity="1" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {/* Main flame - refined shape */}
      <path
        d="M12 2C13 3 14 5 14 7C14.5 9 14 11 13 13.5C12.5 15 12 17 11.5 18C11 19 10.5 19.5 10 18.5C9.5 17 9 15 8.5 13.5C7 11 6.5 9 7 7C7 5 8 3 9 2C10.5 2 11.5 2 12 2Z"
        fill="url(#fireGradient)"
      />
      {/* Inner flame highlight */}
      <path
        d="M11.5 5C12 6 12.5 8 12 10C11.5 12 11 14 10.5 15.5"
        stroke="#FFB84D"
        strokeWidth="1"
        opacity="0.8"
        strokeLinecap="round"
      />
      {/* Secondary flame detail */}
      <path
        d="M12.5 7C13 8 13.2 10 12.8 12C12.5 13.5 12 14.5 11.5 15"
        stroke="#FFD7A2"
        strokeWidth="0.8"
        opacity="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
});

FireIcon.displayName = 'FireIcon';
export default FireIcon;
