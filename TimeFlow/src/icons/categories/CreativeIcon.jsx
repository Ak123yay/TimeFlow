import React from 'react';
import { useIconContext } from '../IconContext';

const CreativeIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#E8C99E' : '#D4A574');

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
      <circle cx="7" cy="18" r="2" fill={resolvedFill} opacity="0.8" />
      <circle cx="15" cy="10" r="2" fill={resolvedFill} opacity="0.8" />
      <circle cx="18" cy="5" r="2" fill={resolvedFill} opacity="0.8" />
      <path d="M3 3H21V21H3Z" stroke={resolvedFill} strokeWidth="1.5" fill={resolvedFill} opacity="0.2" />
    </svg>
  );
});

CreativeIcon.displayName = 'CreativeIcon';
export default CreativeIcon;
