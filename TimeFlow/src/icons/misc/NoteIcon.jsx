import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * NoteIcon - Notes and reminders (outline only)
 */
const NoteIcon = React.memo(({
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
      {/* Note frame outline */}
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="1"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
      />
      {/* Line 1 */}
      <line
        x1="7"
        y1="7"
        x2="17"
        y2="7"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Line 2 */}
      <line
        x1="7"
        y1="11"
        x2="17"
        y2="11"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Line 3 */}
      <line
        x1="7"
        y1="15"
        x2="13"
        y2="15"
        stroke={resolvedFill}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
});

NoteIcon.displayName = 'NoteIcon';
export default NoteIcon;
