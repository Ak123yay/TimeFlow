import React from 'react';
import { haptic } from '../utils/haptics';

/**
 * FirstTimeTooltip - Intro card shown on first visit to a tab
 */
export default function FirstTimeTooltip({ title, description, icon, onDismiss }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(167,211,167,0.15), rgba(111,175,111,0.08))',
      border: '1.5px solid rgba(111,175,111,0.25)',
      borderRadius: '14px',
      padding: '14px 16px',
      marginBottom: '14px',
      animation: 'fadeInUp 0.4s ease-out'
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{
          fontSize: '28px',
          lineHeight: 1,
          flexShrink: 0
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 6px',
            fontSize: '15px',
            fontWeight: 700,
            color: '#1A1A1A'
          }}>
            {title}
          </h3>
          <p style={{
            margin: '0 0 10px',
            fontSize: '13px',
            lineHeight: '1.5',
            color: '#6B8E6B'
          }}>
            {description}
          </p>
          <button
            onClick={() => {
              haptic.light();
              onDismiss();
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: '#3B6E3B',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
          >
            Got it ✓
          </button>
        </div>
      </div>
    </div>
  );
}
