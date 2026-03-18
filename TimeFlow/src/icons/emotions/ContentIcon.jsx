import React from 'react';
import { useIconContext } from '../IconContext';

export const ContentIcon = React.memo(({ size = 24, fill = null, isDark = null, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill={fill ?? '#D4A574'} opacity="0.75" />
    <circle cx="9" cy="10" r="1.5" fill="white" />
    <circle cx="15" cy="10" r="1.5" fill="white" />
    <line x1="9" y1="14" x2="15" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
));

ContentIcon.displayName = 'ContentIcon';
export default ContentIcon;
