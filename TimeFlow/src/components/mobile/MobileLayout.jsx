import { useState, useEffect, useRef } from 'react';
import { useDarkMode } from '../../utils/useDarkMode';
import { haptic } from '../../utils/haptics';
import { SwiftUITabBar } from '../SwiftUIComponents';
import {
  CalendarIcon,
  FireIcon,
  TargetIcon,
  LeafIcon,
  ChartIcon
} from '../../icons';
import '../../styles/mobile.css';

/**
 * MobileLayout - Clean minimal layout shell with iOS-style tab bar
 * No heavy header - content scrolls naturally
 * Bottom nav using native iOS SwiftUI styling
 * Page transitions animated for smooth view changes
 */
export default function MobileLayout({ children, showBottomNav = true, onNavigate, activeTab = 'today' }) {
  // Detect system color scheme
  const isDark = useDarkMode();

  // Track page transition animation
  const [prevTab, setPrevTab] = useState(activeTab);
  const [showAnimation, setShowAnimation] = useState(false);
  const contentRef = useRef(null);

  // Trigger animation when tab changes
  useEffect(() => {
    if (activeTab !== prevTab) {
      setShowAnimation(true);
      setPrevTab(activeTab);
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 400); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [activeTab, prevTab]);

  // Map tab IDs to page indices for SwiftUITabBar
  const tabIndices = {
    'today': 0,
    'week': 1,
    'pool': 2,
    'stats': 3,
    'streak': 4
  };

  const currentIndex = tabIndices[activeTab] || 0;

  const tabItems = [
    {
      icon: <LeafIcon size={20} />,
      label: 'Today'
    },
    {
      icon: <CalendarIcon size={20} />,
      label: 'Week'
    },
    {
      icon: <TargetIcon size={20} />,
      label: 'Pool'
    },
    {
      icon: <ChartIcon size={20} />,
      label: 'Stats'
    },
    {
      icon: <FireIcon size={20} />,
      label: 'Streak'
    }
  ];

  const tabIds = ['today', 'week', 'pool', 'stats', 'streak'];

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
        paddingBottom: showBottomNav ? '110px' : '20px'
      }}>
        <div
          ref={contentRef}
          className={showAnimation ? 'page-transition-enter' : ''}
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '20px 16px',
            paddingBottom: 0
          }}
        >
          {children}
        </div>
      </main>

      {/* Native iOS SwiftUI Tab Bar */}
      {showBottomNav && <SwiftUITabBar
        items={tabItems}
        activeIndex={currentIndex}
        onChange={(index) => {
          haptic.light();
          if (onNavigate) onNavigate(tabIds[index]);
        }}
        style="default"
      />}
    </div>
  );
}
