import React from 'react';
const ChartIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="17" width="4" height="4" fill={fill ?? '#7C9A73'} opacity="0.8" />
    <rect x="10" y="12" width="4" height="9" fill={fill ?? '#7C9A73'} opacity="0.8" />
    <rect x="17" y="6" width="4" height="15" fill={fill ?? '#7C9A73'} opacity="0.8" />
  </svg>
));
ChartIcon.displayName = 'ChartIcon';
export default ChartIcon;
