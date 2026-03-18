import React from 'react';
import { useIconContext } from '../IconContext';

const LearningIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#A68875' : '#8B7355');

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
      <path d="M3 7L12 2L21 7V20H3Z" fill={resolvedFill} opacity="0.2" stroke={resolvedFill} strokeWidth="1.5" />
      <line x1="12" y1="2" x2="12" y2="20" stroke={resolvedFill} strokeWidth="1" opacity="0.5" />
    </svg>
  );
});

LearningIcon.displayName = 'LearningIcon';
export default LearningIcon;
