import React from 'react';
const BulbIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9 21H15M12 3C9.24 3 7 5.24 7 8C7 10.85 8.63 13.37 11 14.84V17H13V14.84C15.37 13.37 17 10.85 17 8C17 5.24 14.76 3 12 3Z" fill={fill ?? '#F9C74F'} opacity="0.85" stroke={fill ?? '#F9C74F'} strokeWidth="0.5" />
  </svg>
));
BulbIcon.displayName = 'BulbIcon';
export default BulbIcon;
