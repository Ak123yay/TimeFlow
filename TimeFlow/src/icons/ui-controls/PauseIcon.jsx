import React from 'react';
const PauseIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="6" y="5" width="3" height="14" rx="1" fill={fill ?? '#7C9A73'} />
    <rect x="15" y="5" width="3" height="14" rx="1" fill={fill ?? '#7C9A73'} />
  </svg>
));
PauseIcon.displayName = 'PauseIcon';
export default PauseIcon;
