import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * CalendarIcon - Date/scheduling indicator
 * Used for date selection and calendar references
 */
const CalendarIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const context = useIconContext();
  const resolvedSize = size;
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#6FAF6F' : '#3B6E3B');

  return (
    <svg
      className={className}
      width={resolvedSize}
      height={resolvedSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="calendarGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Calendar frame with bold border */}
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="17"
        rx="2"
        fill={resolvedFill}
        opacity="0.12"
        stroke="url(#calendarGradient)"
        strokeWidth="2.2"
      />
      {/* Top header bar - bold */}
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="4"
        fill={resolvedFill}
        opacity="0.25"
        rx="2"
      />
      {/* Grid lines - vertical - more visible */}
      <line
        x1="8.5"
        y1="8.5"
        x2="8.5"
        y2="21.5"
        stroke={resolvedFill}
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
      <line
        x1="14.5"
        y1="8.5"
        x2="14.5"
        y2="21.5"
        stroke={resolvedFill}
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
      {/* Grid lines - horizontal */}
      <line
        x1="2.5"
        y1="13.5"
        x2="21.5"
        y2="13.5"
        stroke={resolvedFill}
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
      <line
        x1="2.5"
        y1="17.5"
        x2="21.5"
        y2="17.5"
        stroke={resolvedFill}
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
      {/* Date numbers representation - bolder */}
      <circle cx="5.5" cy="10.5" r="1" fill={resolvedFill} opacity="0.9" />
      <circle cx="11" cy="10.5" r="1" fill={resolvedFill} opacity="0.9" />
      <circle cx="17.5" cy="10.5" r="1" fill={resolvedFill} opacity="0.9" />
      <circle cx="5.5" cy="15.5" r="1" fill={resolvedFill} opacity="0.9" />
      <circle cx="11" cy="15.5" r="1" fill={resolvedFill} opacity="0.9" />
      <circle cx="17.5" cy="15.5" r="1" fill={resolvedFill} opacity="0.9" />
      <circle cx="5.5" cy="19.5" r="1" fill={resolvedFill} opacity="0.9" />
      <circle cx="11" cy="19.5" r="1" fill={resolvedFill} opacity="0.9" />
    </svg>
  );
});

CalendarIcon.displayName = 'CalendarIcon';
export default CalendarIcon;
