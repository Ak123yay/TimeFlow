import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * WarningStatusIcon - Warning status indicator (outline only)
 */
const WarningStatusIcon = React.memo(({
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
      {/* Status circle outline */}
      <circle cx="12" cy="12" r="8" fill="none" stroke={resolvedFill} strokeWidth="1.3" />
    </svg>
  );
});

WarningStatusIcon.displayName = 'WarningStatusIcon';
export default WarningStatusIcon;
