import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * TreeIcon - Tree and nature (outline only)
 */
const TreeIcon = React.memo(({
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
      {/* Tree outline */}
      <path
        d="M12 4L9 10H6L10 14H7L12 21L17 14H14L18 10H15L12 4Z"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

TreeIcon.displayName = 'TreeIcon';
export default TreeIcon;
