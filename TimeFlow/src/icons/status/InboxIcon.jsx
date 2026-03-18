import React from 'react';
const InboxIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
  const resolvedFill = fill ?? '#90E0EF';
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="1.5" fill={resolvedFill} opacity="0.2" stroke={resolvedFill} strokeWidth="1.5" /><path d="M2 9H6C7.5 9 8.5 8 8.5 6.5V9H15.5V6.5C15.5 8 16.5 9 18 9H22" stroke={resolvedFill} strokeWidth="1" /><line x1="2" y1="17" x2="22" y2="17" stroke={resolvedFill} strokeWidth="1" />
    </svg>
  );
});
InboxIcon.displayName = 'InboxIcon';export default InboxIcon;
