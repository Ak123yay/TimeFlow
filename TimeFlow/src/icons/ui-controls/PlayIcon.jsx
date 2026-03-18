import React from 'react';

const PlayIcon = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  const resolvedFill = fill ?? '#52B788';
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
      <defs>
        <linearGradient id="playGradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.95" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* Play triangle with rounded effect */}
      <polygon
        points="7,5 7,19 19,12"
        fill="url(#playGradient)"
        opacity="0.9"
      />
      {/* Inner highlight for depth */}
      <polygon
        points="9,8 9,16 16,12"
        fill={resolvedFill}
        opacity="0.4"
      />
    </svg>
  );
});

PlayIcon.displayName = 'PlayIcon';
export default PlayIcon;
