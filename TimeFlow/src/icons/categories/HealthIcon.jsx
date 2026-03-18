import React from 'react';
import { useIconContext } from '../IconContext';

const HealthIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#6FAF6F' : '#52B788');

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
      <circle cx="12" cy="12" r="9" fill={resolvedFill} opacity="0.2" stroke={resolvedFill} strokeWidth="1.5" />
      <line x1="12" y1="6" x2="12" y2="18" stroke={resolvedFill} strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="12" x2="18" y2="12" stroke={resolvedFill} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
});

HealthIcon.displayName = 'HealthIcon';
export default HealthIcon;
