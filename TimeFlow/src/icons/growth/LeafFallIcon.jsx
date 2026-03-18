import React from 'react';
import { useIconContext } from '../IconContext';

const LeafFallIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? '#E8825A';

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
      {/* Autumn leaf falling */}
      <path
        d="M12 2C12 2 8 8 8 14C8 18.4 9.79 22 12 22C14.21 22 16 18.4 16 14C16 8 12 2 12 2Z"
        fill={resolvedFill}
        opacity="0.85"
        transform="rotate(45 12 12)"
      />
      {/* Vein */}
      <path
        d="M12 5V19"
        stroke={resolvedFill}
        strokeWidth="0.5"
        opacity="0.6"
        transform="rotate(45 12 12)"
      />
    </svg>
  );
});

LeafFallIcon.displayName = 'LeafFallIcon';
export default LeafFallIcon;
