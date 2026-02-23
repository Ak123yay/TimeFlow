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
        padding: '20px 16px',
        paddingBottom: showBottomNav ? '110px' : '20px'
      }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav style={{
          position: 'fixed',
          bottom: 'max(16px, env(safe-area-inset-bottom))',
          left: '12px',
          right: '12px',
          borderRadius: '20px',
          background: isDark ? 'rgba(36,43,36,0.96)' : 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isDark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '10px 4px',
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
              {/* Active pill indicator at top */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: activeTab === item.id ? '20px' : '0px',
                height: '3px',
                borderRadius: '0 0 3px 3px',
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
