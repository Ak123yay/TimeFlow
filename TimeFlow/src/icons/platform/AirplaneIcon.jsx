import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * AirplaneIcon - Travel and movement (outline only)
 */
const AirplaneIcon = React.memo(({
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
      {/* Airplane outline */}
      <path
        d="M12 2L8 8H3L12 15L21 8H16L12 2Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tail lines outline */}
      <path
        d="M5 10L12 15L19 10"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

AirplaneIcon.displayName = 'AirplaneIcon';
export default AirplaneIcon;
