import React from 'react';

/**
 * HealthIndicatorDots - Visual health indicator dots
 * Shows 1-3 dots representing task health status
 * Green: Healthy, Amber: Warning, Red: Critical
 * Used on task cards to give quick visual feedback
 */
export default function HealthIndicatorDots({ health, size = 'sm' }) {
  if (!health || health.status === 'healthy') return null;

  const sizes = {
    xs: { dot: 6, gap: 3 },
    sm: { dot: 8, gap: 4 },
    md: { dot: 10, gap: 5 },
    lg: { dot: 12, gap: 6 }
  };

  const config = sizes[size] || sizes.sm;

  const getColor = () => {
    switch (health.status) {
      case 'critical':
        return 'var(--health-red)';
      case 'warning':
        return 'var(--health-amber)';
      default:
        return 'var(--health-green)';
    }
  };

  // Determine number of dots based on risk score (1-3)
  const dotCount = Math.min(3, Math.max(1, Math.ceil(health.score / 33)));

  return (
    <div
      style={{
        display: 'flex',
        gap: `${config.gap}px`,
        alignItems: 'center',
        title: health.reasons.join(', ')
      }}
    >
      {[...Array(dotCount)].map((_, i) => (
        <div
          key={i}
          style={{
            width: `${config.dot}px`,
            height: `${config.dot}px`,
            borderRadius: '50%',
            backgroundColor: getColor(),
            animation: health.status === 'critical'
              ? `healthPulse 1.5s ease-in-out ${i * 0.1}s infinite`
              : 'none',
            opacity: health.status === 'critical' ? 0.8 : 1
          }}
        />
      ))}
      <style>{`
        @keyframes healthPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.85);
          }
        }
      `}</style>
    </div>
  );
}
