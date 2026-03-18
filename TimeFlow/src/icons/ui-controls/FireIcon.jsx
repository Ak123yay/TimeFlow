import React from 'react';
import { useIconContext } from '../IconContext';

const FireIcon = React.memo(({
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
      {/* Flame outline only */}
      <path
        d="M12 2C13.2 3.5 14.5 5.5 14.5 8C14.5 10 14 11.5 13 13.5C12.5 14.5 12 16 11.5 17.5C11 19 10 20 9.5 17.5C9 16 8.5 14.5 8 13.5C7 11.5 6.5 10 6.5 8C6.5 5.5 7.8 3.5 9 2C10 1.8 11 1.8 12 2Z"
        stroke={resolvedFill}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center line for detail */}
      <path
        d="M11.5 4.5Q12 9 11.5 15"
        stroke={resolvedFill}
        strokeWidth="0.9"
        opacity="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
});

FireIcon.displayName = 'FireIcon';
export default FireIcon;
