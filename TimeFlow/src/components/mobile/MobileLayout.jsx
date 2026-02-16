import React from 'react';
import { haptic } from '../../utils/haptics';
import '../../styles/mobile.css';

/**
 * MobileLayout - Clean minimal layout shell
 * No heavy header - content scrolls naturally
 * Bottom nav for main navigation
 */
export default function MobileLayout({ children, showBottomNav = true, onNavigate, activeTab = 'today' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      background: '#F8F8F8',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {/* Scrollable Content */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        padding: '20px 16px',
        paddingBottom: showBottomNav ? '90px' : '20px'
      }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'calc(56px + env(safe-area-inset-bottom))',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '0.5px solid rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          paddingTop: '8px',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          zIndex: 200
        }}>
          {[
            { id: 'today', icon: '🌿', label: 'Today' },
            { id: 'week', icon: '📅', label: 'Week' },
            { id: 'pool', icon: '🌊', label: 'Pool' },
            { id: 'stats', icon: '📊', label: 'Stats' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                haptic.light();
                if (onNavigate) onNavigate(item.id);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                background: 'none',
                border: 'none',
                padding: '4px 16px',
                minWidth: '44px',
                minHeight: '44px',
                color: activeTab === item.id ? '#3B6E3B' : '#8E8E93',
                fontSize: '10px',
                fontWeight: activeTab === item.id ? 600 : 400,
                cursor: 'pointer',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                transition: 'color 0.2s'
              }}
            >
              <span style={{ fontSize: '22px', lineHeight: 1 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
