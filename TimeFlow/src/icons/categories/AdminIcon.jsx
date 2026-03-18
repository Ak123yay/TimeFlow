import React from 'react';
import { useIconContext } from '../IconContext';

const AdminIcon = React.memo(({
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
      <rect x="3" y="4" width="18" height="16" rx="1.5" fill={resolvedFill} opacity="0.2" stroke={resolvedFill} strokeWidth="1.5" />
      <line x1="3" y1="9" x2="21" y2="9" stroke={resolvedFill} strokeWidth="1" />
      <line x1="3" y1="14" x2="21" y2="14" stroke={resolvedFill} strokeWidth="1" />
      <circle cx="7" cy="6.5" r="1" fill={resolvedFill} />
    </svg>
  );
});

AdminIcon.displayName = 'AdminIcon';
export default AdminIcon;
