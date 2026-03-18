import React from 'react';
const NutIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="12" cy="12" rx="7" ry="8" fill={fill ?? '#8B7355'} opacity="0.8" /><path d="M9 10C9 9 10.5 8 12 8C13.5 8 15 9 15 10" fill={fill ?? "#9B8365"} opacity="0.6" />
  </svg>
));
NutIcon.displayName = 'NutIcon';export default NutIcon;
