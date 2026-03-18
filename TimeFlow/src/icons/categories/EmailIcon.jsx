import React from 'react';
import { useIconContext } from '../IconContext';

const EmailIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#A8D8E8' : '#90E0EF');

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
      <rect x="2" y="4" width="20" height="16" rx="2" fill={resolvedFill} opacity="0.2" stroke={resolvedFill} strokeWidth="1.5" />
      <path d="M2 6L12 13L22 6" stroke={resolvedFill} strokeWidth="1.5" />
    </svg>
  );
});

EmailIcon.displayName = 'EmailIcon';
export default EmailIcon;
