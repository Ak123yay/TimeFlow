import { useState, useEffect } from 'react';
import { useDarkMode } from '../utils/useDarkMode';
import { haptic } from '../utils/haptics';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Only show if user hasn't dismissed before
      const dismissed = localStorage.getItem('timeflow-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    haptic.success();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    haptic.light();
    localStorage.setItem('timeflow-install-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  const isDark = useDarkMode();

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      left: '16px',
      right: '16px',
      zIndex: 1000,
      background: isDark ? '#242B24' : '#fff',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      border: `2px solid ${isDark ? '#6B7B6B' : '#3B6E3B'}`,
      animation: 'slideUp 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ fontSize: '32px' }}>🌿</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#E8F0E8' : '#1A1A1A' }}>
            Install TimeFlow
          </div>
          <div style={{ fontSize: '12px', color: isDark ? '#9CA59C' : '#8E8E93', marginTop: '2px' }}>
            Quick access from your home screen
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleDismiss}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: `1.5px solid ${isDark ? '#6B7B6B' : '#E5E5E5'}`,
            background: isDark ? '#1A1F1A' : '#F5F5F5',
            color: isDark ? '#E8F0E8' : '#1A1A1A',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Not Now
        </button>
        <button
          onClick={handleInstall}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: '#3B6E3B',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Install
        </button>
      </div>
    </div>
  );
}
