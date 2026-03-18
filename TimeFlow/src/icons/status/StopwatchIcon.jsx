import React from 'react';
const StopwatchIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
  const resolvedFill = fill ?? '#7C9A73';
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="14" r="8" fill="none" stroke={resolvedFill} strokeWidth="1.5" /><line x1="12" y1="14" x2="12" y2="10" stroke={resolvedFill} strokeWidth="1.5" strokeLinecap="round" /><line x1="9" y1="4" x2="9" y2="6" stroke={resolvedFill} strokeWidth="1" /><line x1="15" y1="4" x2="15" y2="6" stroke={resolvedFill} strokeWidth="1" />
    </svg>
  );
});
StopwatchIcon.displayName = 'StopwatchIcon';export default StopwatchIcon;
