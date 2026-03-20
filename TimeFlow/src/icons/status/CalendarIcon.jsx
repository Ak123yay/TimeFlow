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
      {/* Calendar frame outline - clean rectangle */}
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="1.5"
        stroke={resolvedFill}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Header divider - single clean line */}
      <line
        x1="3"
        y1="8.5"
        x2="21"
        y2="8.5"
        stroke={resolvedFill}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Calendar dates - simple dots in 2x2 grid pattern */}
      <circle cx="6" cy="11.5" r="0.6" fill={resolvedFill} />
      <circle cx="12" cy="11.5" r="0.6" fill={resolvedFill} />
      <circle cx="6" cy="17" r="0.6" fill={resolvedFill} />
      <circle cx="12" cy="17" r="0.6" fill={resolvedFill} />
    </svg>
  );
});

CalendarIcon.displayName = 'CalendarIcon';
export default CalendarIcon;
