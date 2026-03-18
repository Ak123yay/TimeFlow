import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * EmailIcon - Email and communication (outline only)
 */
const EmailIcon = React.memo(({
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
      {/* Envelope outline */}
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        fill="none"
        stroke={resolvedFill}
        strokeWidth="1.3"
      />
      {/* Envelope flap */}
      <path
        d="M2 6L12 13L22 6"
        stroke={resolvedFill}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

EmailIcon.displayName = 'EmailIcon';
export default EmailIcon;
