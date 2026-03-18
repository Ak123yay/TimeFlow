import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * CalendarIcon - Outlined calendar only
 */
const CalendarIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#888' : '#999');

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Calendar frame outline */}
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="1.5"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Header divider line */}
      <line
        x1="3"
        y1="8.5"
        x2="21"
        y2="8.5"
        stroke={resolvedFill}
        strokeWidth="1.1"
        opacity="0.7"
        strokeLinecap="round"
      />

      {/* Grid dividers - vertical */}
      <line
        x1="9"
        y1="8.5"
        x2="9"
        y2="21"
        stroke={resolvedFill}
        strokeWidth="0.9"
        opacity="0.5"
        strokeLinecap="round"
      />
      <line
        x1="15"
        y1="8.5"
        x2="15"
        y2="21"
        stroke={resolvedFill}
        strokeWidth="0.9"
        opacity="0.5"
        strokeLinecap="round"
      />

      {/* Grid dividers - horizontal */}
      <line
        x1="3"
        y1="14"
        x2="21"
        y2="14"
        stroke={resolvedFill}
        strokeWidth="0.9"
        opacity="0.5"
        strokeLinecap="round"
      />

      {/* Date circles outline only */}
      <circle cx="6" cy="11.2" r="0.7" stroke={resolvedFill} strokeWidth="0.9" opacity="0.8" />
      <circle cx="12" cy="11.2" r="0.7" stroke={resolvedFill} strokeWidth="0.9" opacity="0.8" />
      <circle cx="18" cy="11.2" r="0.7" stroke={resolvedFill} strokeWidth="0.9" opacity="0.8" />
    </svg>
  );
});

CalendarIcon.displayName = 'CalendarIcon';
export default CalendarIcon;
