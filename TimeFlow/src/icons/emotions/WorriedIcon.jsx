import React from 'react';
const WorriedIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill={fill ?? '#FF6B6B'} opacity="0.85" /><circle cx="8.5" cy="9" r="1.5" fill="white" /><circle cx="15.5" cy="9" r="1.5" fill="white" /><path d="M9 16C10 14 11.5 13 12 13C12.5 13 14 14 15 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
));
WorriedIcon.displayName = 'WorriedIcon';export default WorriedIcon;
