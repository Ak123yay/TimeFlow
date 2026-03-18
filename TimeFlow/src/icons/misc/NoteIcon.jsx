import React from 'react';

const NoteIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const resolvedFill = fill ?? '#7C9A73';
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
      <rect x="4" y="3" width="16" height="18" rx="1" fill={resolvedFill} opacity="0.2" stroke={resolvedFill} strokeWidth="1" />
      <line x1="7" y1="7" x2="17" y2="7" stroke={resolvedFill} strokeWidth="0.8" />
      <line x1="7" y1="11" x2="17" y2="11" stroke={resolvedFill} strokeWidth="0.8" />
      <line x1="7" y1="15" x2="13" y2="15" stroke={resolvedFill} strokeWidth="0.8" />
    </svg>
  );
});

NoteIcon.displayName = 'NoteIcon';
export default NoteIcon;
