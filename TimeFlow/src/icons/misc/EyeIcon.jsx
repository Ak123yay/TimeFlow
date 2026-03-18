import React from 'react';
import { useIconContext } from '../IconContext';

const EyeIcon = React.memo(({
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
      {/* Eye outline */}
      <path
        d="M12 5C7 5 2.73 8.11 1 12.46C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.46C21.27 8.11 17 5 12 5Z"
        stroke={resolvedFill}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Pupil */}
      <circle cx="12" cy="12" r="3" fill={resolvedFill} opacity="0.7" />
    </svg>
  );
});

EyeIcon.displayName = 'EyeIcon';
export default EyeIcon;
