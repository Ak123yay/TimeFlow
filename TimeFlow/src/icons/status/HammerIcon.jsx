import React from 'react';
const HammerIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
  const resolvedFill = fill ?? '#8B7355';
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="3" width="5" height="6" fill={resolvedFill} opacity="0.8" /><line x1="13.5" y1="9" x2="22" y2="17.5" stroke={resolvedFill} strokeWidth="2" strokeLinecap="round" /><circle cx="8.7" cy="20" r="1.5" fill={resolvedFill} />
    </svg>
  );
});
HammerIcon.displayName = 'HammerIcon';export default HammerIcon;
