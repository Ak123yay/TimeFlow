import React from 'react';
const UneasyIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill={fill ?? '#E8825A'} opacity="0.8" /><circle cx="8.5" cy="9" r="1.5" fill="white" /><circle cx="15.5" cy="9" r="1.5" fill="white" /><path d="M10 15C10 13.5 11 13 12 13C13 13 14 13.5 14 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
));
UneasyIcon.displayName = 'UneasyIcon';export default UneasyIcon;
