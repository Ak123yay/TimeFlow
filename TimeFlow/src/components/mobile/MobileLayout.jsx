import { useState, useEffect } from 'react';
import { useDarkMode } from '../../utils/useDarkMode';
import { haptic } from '../../utils/haptics';
import '../../styles/mobile.css';

/**
 * MobileLayout - Clean minimal layout shell
 * No heavy header - content scrolls naturally
 * Bottom nav for main navigation
 */
export default function MobileLayout({ children, showBottomNav = true, onNavigate, activeTab = 'today' }) {
  // Detect system color scheme
  const isDark = useDarkMode();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      background: isDark ? '#1A1F1A' : '#f0f4f1',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {/* Scrollable Content */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: showBottomNav ? 'calc(70px + env(safe-area-inset-bottom))' : '20px'
      }}>
        <div style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '20px 16px',
          paddingBottom: 0
        }}>
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: 0,
          background: isDark ? 'rgba(26,31,26,0.97)' : 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: isDark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.08)',
          boxShadow: 'none',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: `10px 4px max(10px, env(safe-area-inset-bottom))`,
          zIndex: 200
        }}>
          {[
            { id: 'today', icon: 'schedule', label: 'Today' },
            { id: 'week', icon: 'calendar_view_week', label: 'Week' },
            { id: 'pool', icon: 'format_list_bulleted', label: 'Pool' },
            { id: 'stats', icon: 'bar_chart', label: 'Stats' },
            { id: 'streak', icon: 'local_fire_department', label: 'Streak' }
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
                padding: '4px 8px',
                flex: 1,
                minHeight: '44px',
                color: activeTab === item.id ? '#3B6E3B' : (isDark ? '#9CA59C' : '#8E8E93'),
                fontSize: '9px',
                fontWeight: activeTab === item.id ? 700 : 400,
                cursor: 'pointer',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                transition: 'color 0.2s',
                position: 'relative'
              }}
            >
      {/* Active indicator - top line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: activeTab === item.id ? '24px' : '0px',
                height: '2px',
                borderRadius: '0 0 2px 2px',
                background: '#3B6E3B',
                transition: 'width 0.2s ease'
              }} />
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '22px',
                  lineHeight: 1,
                  fontVariationSettings: activeTab === item.id
                    ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
                    : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24"
                }}
              >{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
