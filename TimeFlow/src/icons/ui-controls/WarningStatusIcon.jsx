import React from 'react';
import { useIconContext } from '../IconContext';

const WarningStatusIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? '#F9C74F';

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
      <circle cx="12" cy="12" r="8" fill={resolvedFill} opacity="0.9" />
    </svg>
  );
});

WarningStatusIcon.displayName = 'WarningStatusIcon';
export default WarningStatusIcon;
