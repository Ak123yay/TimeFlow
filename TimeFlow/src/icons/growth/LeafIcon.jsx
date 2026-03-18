import React from 'react';
import { useIconContext } from '../IconContext';

/**
 * LeafIcon - Nature-themed leaf representing growth and tasks
 * Core icon for TimeFlow's plant-based metaphor
 */
const LeafIcon = React.memo(({
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
        <linearGradient id="leafGradientHorizontal" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={resolvedFill} stopOpacity="0.65" />
          <stop offset="40%" stopColor={resolvedFill} stopOpacity="0.98" />
          <stop offset="100%" stopColor={resolvedFill} stopOpacity="0.72" />
        </linearGradient>
      </defs>
      {/* Outer leaf shape - refined curves */}
      <path
        d="M2 12C2 10 4 8 8.5 8C13.5 8 17.5 9 20.5 12C17.5 15 13.5 16 8.5 16C4 16 2 14 2 12Z"
        fill="url(#leafGradientHorizontal)"
        opacity="0.96"
        stroke={resolvedFill}
        strokeWidth="0.6"
        strokeOpacity="0.6"
      />

      {/* PRIMARY VEIN - central strong rib */}
      <path
        d="M3 12Q8.5 11 20 12"
        stroke={resolvedFill}
        strokeWidth="1.3"
        opacity="0.85"
        strokeLinecap="round"
      />

      {/* UPPER VEIN SYSTEM */}
      {/* Upper primary branch */}
      <path
        d="M5 9Q8 8 12 8.5"
        stroke={resolvedFill}
        strokeWidth="0.9"
        opacity="0.55"
        strokeLinecap="round"
      />
      {/* Upper secondary branches - left */}
      <path
        d="M4.5 10Q6 9 8.5 9"
        stroke={resolvedFill}
        strokeWidth="0.6"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M6 9.5Q8 8.5 10 9"
        stroke={resolvedFill}
        strokeWidth="0.5"
        opacity="0.35"
        strokeLinecap="round"
      />
      {/* Upper secondary branches - right */}
      <path
        d="M13 8.5Q15.5 8 17.5 9"
        stroke={resolvedFill}
        strokeWidth="0.6"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M15 8Q17 8.2 19 9"
        stroke={resolvedFill}
        strokeWidth="0.5"
        opacity="0.35"
        strokeLinecap="round"
      />

      {/* LOWER VEIN SYSTEM */}
      {/* Lower primary branch */}
      <path
        d="M5 15Q8 16 12 15.5"
        stroke={resolvedFill}
        strokeWidth="0.9"
        opacity="0.55"
        strokeLinecap="round"
      />
      {/* Lower secondary branches - left */}
      <path
        d="M4.5 14Q6 15 8.5 15"
        stroke={resolvedFill}
        strokeWidth="0.6"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M6 14.5Q8 15.5 10 15"
        stroke={resolvedFill}
        strokeWidth="0.5"
        opacity="0.35"
        strokeLinecap="round"
      />
      {/* Lower secondary branches - right */}
      <path
        d="M13 15.5Q15.5 16 17.5 15"
        stroke={resolvedFill}
        strokeWidth="0.6"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M15 16Q17 15.8 19 15"
        stroke={resolvedFill}
        strokeWidth="0.5"
        opacity="0.35"
        strokeLinecap="round"
      />

      {/* TERTIARY FINE VEINS - right section */}
      <path
        d="M14 9.5Q16 9 18 10"
        stroke={resolvedFill}
        strokeWidth="0.4"
        opacity="0.25"
        strokeLinecap="round"
      />
      <path
        d="M15 14Q16.5 14.5 18.5 14"
        stroke={resolvedFill}
        strokeWidth="0.4"
        opacity="0.25"
        strokeLinecap="round"
      />

      {/* Leaf tip - glowing highlight */}
      <ellipse
        cx="19.5"
        cy="12"
        rx="2.3"
        ry="1.8"
        fill={resolvedIsDark ? '#A8D4A8' : '#52B788'}
        opacity="0.5"
      />

      {/* Leaf base - subtle highlight */}
      <ellipse
        cx="4.5"
        cy="12"
        rx="1.5"
        ry="1.2"
        fill={resolvedIsDark ? '#A8D4A8' : '#52B788'}
        opacity="0.35"
      />
    </svg>
  );
});

LeafIcon.displayName = 'LeafIcon';
export default LeafIcon;
