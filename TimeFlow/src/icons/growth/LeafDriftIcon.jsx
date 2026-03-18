import React from 'react';
const LeafDriftIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2C12 2 8 8 8 14C8 18.4 9.79 22 12 22C14.21 22 16 18.4 16 14C16 8 12 2 12 2Z" fill={fill ?? '#9AC98B'} opacity="0.8" transform="rotate(20 12 12)" />
  </svg>
));
LeafDriftIcon.displayName = 'LeafDriftIcon';export default LeafDriftIcon;
