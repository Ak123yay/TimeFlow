import React from 'react';
const SadIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill={fill ?? '#7C8FA3'} opacity="0.8" /><circle cx="9" cy="10" r="1.5" fill="white" /><circle cx="15" cy="10" r="1.5" fill="white" /><path d="M9 15C10 14 11 13 12 13C13 13 14.5 14 15 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
));
SadIcon.displayName = 'SadIcon';export default SadIcon;
