import React from 'react';
const AppleIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17.05 20.28c-3.87 4.05-10.02 4.3-14.34.5-4.32-3.81-4.57-10.24-.5-14.11 4.07-3.87 10.5-3.66 14.33.5" fill={fill ?? '#FF6B6B'} opacity="0.8" />
    <line x1="12" y1="2" x2="12" y2="4" stroke={fill ?? '#FF6B6B'} strokeWidth="1" />
  </svg>
));
AppleIcon.displayName = 'AppleIcon';
export default AppleIcon;
