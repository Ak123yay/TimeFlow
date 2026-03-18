import React from 'react';
const DesktopIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2 4H22V14H2Z" fill={fill ?? '#7C9A73'} opacity="0.2" stroke={fill ?? '#7C9A73'} strokeWidth="1.5" rx="1" />
    <line x1="8" y1="14" x2="16" y2="14" stroke={fill ?? '#7C9A73'} strokeWidth="2" />
    <line x1="10" y1="14" x2="14" y2="20" stroke={fill ?? '#7C9A73'} strokeWidth="1.5" />
  </svg>
));
DesktopIcon.displayName = 'DesktopIcon';
export default DesktopIcon;
