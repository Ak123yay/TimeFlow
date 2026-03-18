import React from 'react';
import { useIconContext } from '../IconContext';

const BellMutedIcon = React.memo(({
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
      {/* Bell curve faded */}
      <path
        d="M18 8C18 6 16 4 12 4C8 4 6 6 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        fill={resolvedFill}
        opacity="0.4"
      />
      {/* Clapper faded */}
      <ellipse cx="12" cy="19" rx="1" ry="2" fill={resolvedFill} opacity="0.4" />
      {/* Slash line */}
      <line x1="3" y1="3" x2="21" y2="21" stroke={resolvedFill} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
});

BellMutedIcon.displayName = 'BellMutedIcon';
export default BellMutedIcon;
