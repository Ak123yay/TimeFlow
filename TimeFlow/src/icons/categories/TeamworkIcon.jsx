import React from 'react';
import { useIconContext } from '../IconContext';

const TeamworkIcon = React.memo(({
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
      <circle cx="8" cy="8" r="3" fill={resolvedFill} opacity="0.8" />
      <circle cx="16" cy="8" r="3" fill={resolvedFill} opacity="0.8" />
      <circle cx="12" cy="15" r="3" fill={resolvedFill} opacity="0.8" />
      <path d="M8 11C5 11 3 13 3 15V20H13V15C13 13 11 11 8 11Z" fill={resolvedFill} opacity="0.5" />
      <path d="M16 11C19 11 21 13 21 15V20H11V15C11 13 13 11 16 11Z" fill={resolvedFill} opacity="0.5" />
    </svg>
  );
});

TeamworkIcon.displayName = 'TeamworkIcon';
export default TeamworkIcon;
