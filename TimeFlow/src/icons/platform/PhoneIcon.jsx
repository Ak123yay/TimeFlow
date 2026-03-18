import React from 'react';
const PhoneIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="5" y="2" width="14" height="20" rx="2.5" fill="none" stroke={fill ?? '#7C9A73'} strokeWidth="1.5" />
    <circle cx="12" cy="19" r="1" fill={fill ?? '#7C9A73'} />
  </svg>
));
PhoneIcon.displayName = 'PhoneIcon';
export default PhoneIcon;
