import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * LearningIcon - Learning and education (outline only)
 */
const LearningIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#888' : '#999');

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Graduation cap outline */}
      <path
        d="M3 7L12 2L21 7V20H3Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center line detail */}
      <line
        x1="12"
        y1="2"
        x2="12"
        y2="20"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

LearningIcon.displayName = 'LearningIcon';
export default LearningIcon;
