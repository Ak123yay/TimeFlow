import React from 'react';
const RefreshIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => {
  const resolvedFill = fill ?? '#7C9A73';
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 12C3 7.03 7.03 3 12 3C15.26 3 18.062 4.94 19.38 7.7" stroke={resolvedFill} strokeWidth="1.5" strokeLinecap="round" /><path d="M21 12C21 16.97 16.97 21 12 21C8.74 21 5.938 19.06 4.62 16.3" stroke={resolvedFill} strokeWidth="1.5" strokeLinecap="round" /><polygon points="20,7.7 21,4 17,4" fill={resolvedFill} opacity="0.5" /><polygon points="4,16.3 3,20 7,20" fill={resolvedFill} opacity="0.5" />
    </svg>
  );
});
RefreshIcon.displayName = 'RefreshIcon';export default RefreshIcon;
