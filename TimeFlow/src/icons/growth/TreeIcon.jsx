import React from 'react';
const TreeIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
  const resolvedFill = fill ?? '#3B6E3B';
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 4L9 10H6L10 14H7L12 21L17 14H14L18 10H15L12 4Z" fill={resolvedFill} opacity="0.85" />
    </svg>
  );
});
TreeIcon.displayName = 'TreeIcon';export default TreeIcon;
