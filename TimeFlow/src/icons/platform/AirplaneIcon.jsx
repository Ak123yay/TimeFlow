import React from 'react';
const AirplaneIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2L8 8H3L12 15L21 8H16L12 2Z" fill={fill ?? '#90E0EF'} opacity="0.8" />
    <path d="M5 10L12 15L19 10" stroke={fill ?? '#90E0EF'} strokeWidth="1" opacity="0.6" />
  </svg>
));
AirplaneIcon.displayName = 'AirplaneIcon';
export default AirplaneIcon;
